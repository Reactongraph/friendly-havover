import React, { ReactNode, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { Account, UserMetadata } from './types';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { useUserAccounts } from './hooks/useUserAccounts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get authentication session state
  const { session, user, isLoading } = useAuthSession();
  
  // State for current account
  const [accountState, setAccountState] = useState<Account | null>(null);
  
  // Get user accounts state and operations
  const { 
    userAccounts, 
    isLoadingAccounts, 
    currentAccount, 
    setCurrentAccount,
    jwtAccountId 
  } = useUserAccounts(user, accountState);
  
  // Create a function to clear account state on logout
  const clearAccountState = () => {
    setAccountState(null);
  };
  
  // Log JWT account_id claim for debugging
  useEffect(() => {
    if (session?.access_token) {
      try {
        const payload = JSON.parse(atob(session.access_token.split('.')[1]));
        console.log('[JWT Debug] Current JWT account_id claim:', payload.account_id || 'undefined');
        
        // Check if the account_id claim is missing and user has accounts
        if (!payload.account_id && userAccounts.length > 0) {
          console.warn('[JWT Debug] No account_id in JWT but user has accounts - session refresh needed');
          
          // Show toast warning about missing account_id in JWT
          toast({
            title: "Critical: Session needs refresh",
            description: "Your session doesn't contain account information. Please use the 'Refresh Session' button to sign out and back in.",
            variant: "destructive",
            duration: 15000,
          });
        }
      } catch (error) {
        console.error('[JWT Debug] Error parsing JWT:', error);
      }
    }
  }, [session, userAccounts]);
  
  // Function to set current account and update JWT claims
  const handleSetCurrentAccount = async (account: Account) => {
    // Update local state immediately for responsive UI
    setAccountState(account);
    setCurrentAccount(account);
    
    // Check if the selected account matches the JWT claim
    if (jwtAccountId !== account.id) {
      // Show a critical warning toast that session refresh is required
      toast({
        title: "Account switched - CRITICAL ACTION REQUIRED",
        description: "To use this account, you MUST refresh your session by signing out and signing back in. Use the 'Refresh Session' button in the account switcher.",
        variant: "destructive",
        duration: 15000, // Show for 15 seconds
      });
    }
  };
  
  // Get authentication operations - modify to handle metadata properly
  const { signIn, signOut } = useAuthOperations(
    (newSession) => {}, // useAuthSession handles this
    (newUser) => {},    // useAuthSession handles this
    clearAccountState
  );

  // Custom signUp function to handle metadata
  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `https://friendly-handover.vercel.app/`
        }
      });
      
      if (error) throw error;
      
      if (data?.user?.identities?.length === 0) {
        throw new Error('Email already registered');
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account",
      });
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during sign up";
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Get the effective account - either the selected one or the first available
  const effectiveAccount = currentAccount || (userAccounts.length > 0 ? userAccounts[0].account : null);

  // Combine all values for the context
  const authContextValue = {
    session,
    user,
    userAccounts,
    currentAccount: effectiveAccount,
    isLoading,
    isLoadingAccounts,
    signIn,
    signUp,
    signOut,
    setCurrentAccount: handleSetCurrentAccount,
    jwtAccountId,
    jwtParsingError: false
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
