import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, LoaderCircle, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
export const AccountSwitcher: React.FC = () => {
  const {
    user,
    userAccounts,
    currentAccount,
    setCurrentAccount,
    isLoadingAccounts,
    signOut,
    jwtAccountId,
    jwtParsingError
  } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasJwtAccountId, setHasJwtAccountId] = useState<boolean | null>(null);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  // Aggressive JWT validation on component mount and when user changes
  useEffect(() => {
    if (user) {
      checkJwtHasAccountId();
    }
  }, [user]);

  // Set the refresh dialog state based on JWT error
  useEffect(() => {
    if (jwtParsingError && user) {
      // Automatically open dialog if JWT has parsing errors
      setShowRefreshDialog(true);
      setHasJwtAccountId(false);
    } else if (jwtAccountId) {
      setHasJwtAccountId(true);
      setShowRefreshDialog(false);
    } else if (jwtAccountId === null && user) {
      setHasJwtAccountId(false);
      // Only auto-open if we're sure there's no account ID
      setShowRefreshDialog(true);
    }
  }, [jwtAccountId, jwtParsingError, user]);
  if (!user) {
    return null;
  }
  const handleAccountChange = (accountId: string) => {
    const account = userAccounts.find(ua => ua.account.id === accountId)?.account || null;
    if (account) {
      setCurrentAccount(account);

      // Always show a destructive toast to emphasize session refresh requirement
      toast({
        title: "IMPORTANT: Session refresh required",
        description: "Your session token MUST be refreshed for this change to take effect. Click the 'REFRESH SESSION NOW' button in the account menu.",
        variant: "destructive",
        duration: 15000
      });

      // Automatically open the refresh dialog when switching accounts
      setShowRefreshDialog(true);
    } else {
      toast({
        title: "Account switch failed",
        description: "Could not find the selected account.",
        variant: "destructive"
      });
    }
  };
  const handleSignOutAndIn = async () => {
    setIsRefreshing(true);
    try {
      toast({
        title: "Refreshing session",
        description: "You will be signed out. Please sign back in immediately after being redirected to the login page.",
        variant: "default"
      });

      // Small delay to allow toast to be seen
      setTimeout(() => {
        signOut();
      }, 1500);
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast({
        title: "Session refresh failed",
        description: "Please try again or manually sign out and sign back in.",
        variant: "destructive"
      });
      setIsRefreshing(false);
      setShowRefreshDialog(false);
    }
  };

  // Aggressively check if JWT token contains account_id
  const checkJwtHasAccountId = async () => {
    try {
      // First check the JWT directly by parsing it from session
      const {
        data
      } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        const parts = data.session.access_token.split('.');
        if (parts.length !== 3) {
          console.error('[JWT Debug] Invalid JWT format - does not have three parts');
          setHasJwtAccountId(false);
          return false;
        }
        try {
          // Ensure proper padding for Base64 decoding
          const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const paddedPayload = base64Payload + '==='.slice(0, (4 - base64Payload.length % 4) % 4);

          // Decode and parse the payload
          const payload = JSON.parse(atob(paddedPayload));
          console.log('[JWT Debug] JWT payload:', {
            ...payload,
            sub: 'redacted'
          }); // Log payload (sanitized)

          const hasAccountId = !!payload.account_id;
          setHasJwtAccountId(hasAccountId);
          if (!hasAccountId) {
            console.error('JWT missing account_id claim. User must refresh session.', {
              userId: user.id,
              hasAccountId
            });

            // Open dialog automatically if missing account_id
            setShowRefreshDialog(true);
          }
          return hasAccountId;
        } catch (parseError) {
          console.error('[JWT Debug] Error parsing JWT payload:', parseError);
          setHasJwtAccountId(false);
          setShowRefreshDialog(true);
          return false;
        }
      }
      console.warn('[JWT Debug] No valid access token found');
      setHasJwtAccountId(false);
      setShowRefreshDialog(true);
      return false;
    } catch (error) {
      console.error('Error checking JWT:', error);
      setHasJwtAccountId(false);
      setShowRefreshDialog(true);
      return false;
    }
  };

  // Session refresh dialog
  const RefreshSessionDialog = () => <Dialog open={showRefreshDialog} onOpenChange={setShowRefreshDialog}>
      
    </Dialog>;

  // If JWT is missing account_id claim, show critical alert
  if (hasJwtAccountId === false) {
    return <div className="space-y-4">
        
        {RefreshSessionDialog()}
      </div>;
  }

  // If JWT has correct account_id but mismatch with current account, show warning
  if (jwtAccountId && currentAccount && jwtAccountId !== currentAccount.id) {
    return <div className="space-y-4">
        <Alert variant="destructive" className="border-amber-600 bg-amber-100/30 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-bold">Account Mismatch</AlertTitle>
          <AlertDescription className="mt-2">
            Your current account doesn't match the account in your session token.
            <strong className="block mt-1">You need to refresh your session for account switching to work correctly.</strong>
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={handleSignOutAndIn} className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none" disabled={isRefreshing} size="sm">
              {isRefreshing ? <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </> : <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  REFRESH SESSION NOW
                </>}
            </Button>
          </div>
        </Alert>
        {RefreshSessionDialog()}
      </div>;
  }

  // Standard account switching dropdown
  return <div className="space-y-4">
      {RefreshSessionDialog()}
      
      {userAccounts.length > 0 ? <>
          <div className="flex items-center space-x-2 mb-1">
            <Building className="h-4 w-4 text-sidebar-foreground opacity-70" />
            <span className="text-xs text-sidebar-foreground opacity-70">Switch account</span>
          </div>
          <Select value={currentAccount?.id || ""} onValueChange={handleAccountChange} disabled={isLoadingAccounts}>
            <SelectTrigger className="w-full bg-sidebar-accent/20 border-sidebar-border text-sidebar-foreground">
              {isLoadingAccounts ? <div className="flex items-center">
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading accounts...</span>
                </div> : <SelectValue placeholder="Select an account" />}
            </SelectTrigger>
            <SelectContent>
              {userAccounts.map(ua => <SelectItem key={ua.account.id} value={ua.account.id}>
                  <div className="flex items-center">
                    <span className="mr-2">{ua.account.name}</span>
                    <span className="text-xs text-muted-foreground">({ua.role})</span>
                  </div>
                </SelectItem>)}
            </SelectContent>
          </Select>
        </> : isLoadingAccounts ? <div className="flex items-center space-x-2 py-2">
          <LoaderCircle className="h-4 w-4 animate-spin text-sidebar-foreground" />
          <span className="text-sm text-sidebar-foreground">Loading accounts...</span>
        </div> : <div className="text-sm text-sidebar-foreground/70 py-2">No accounts available</div>}

      {/* Session refresh button always available */}
      {!isRefreshing && <Button onClick={() => setShowRefreshDialog(true)} size="sm" variant="outline" className="w-full text-xs border-sidebar-border bg-sidebar-accent/10 text-sidebar-foreground hover:bg-sidebar-accent/20 mt-2">
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh Session
        </Button>}
    </div>;
};