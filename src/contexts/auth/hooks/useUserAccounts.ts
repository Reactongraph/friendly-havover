
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Account, UserAccount } from '../types';
import { toast } from '@/components/ui/use-toast';

export function useUserAccounts(user: User | null, currentAccount: Account | null) {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(currentAccount);
  const [jwtAccountId, setJwtAccountId] = useState<string | null>(null);
  const [jwtFetchAttempted, setJwtFetchAttempted] = useState(false);
  const [jwtParsingError, setJwtParsingError] = useState<string | null>(null);

  // Check JWT for account_id claim
  useEffect(() => {
    const checkJwtAccountId = async () => {
      if (!user) return;
      
      try {
        // Get current session to check JWT contents
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[JWT Check] Error getting session:', error);
          setJwtParsingError(`Session error: ${error.message}`);
          setJwtAccountId(null);
          return;
        }
        
        if (data.session?.access_token) {
          try {
            // Parse JWT payload safely
            const [, payloadBase64] = data.session.access_token.split('.');
            if (!payloadBase64) {
              console.error('[JWT Check] Invalid JWT format - missing payload section');
              setJwtParsingError('Invalid JWT format');
              setJwtAccountId(null);
              return;
            }
            
            // Ensure padding for base64 decoding
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
            
            // Decode and parse
            const jsonStr = atob(padded);
            const payload = JSON.parse(jsonStr);
            
            // Extract account_id
            const accountId = payload.account_id;
            setJwtAccountId(accountId || null);
            
            // Log detailed JWT info
            console.log('[JWT Check] Payload:', { 
              iss: payload.iss,
              aud: payload.aud,
              exp: payload.exp,
              iat: payload.iat,
              has_account_id: !!accountId,
              account_id: accountId || 'Not present',
              token_expiry: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Unknown'
            });
            
            if (!accountId) {
              console.warn('[JWT Check] No account_id found in JWT. User may need to refresh their session.');
              setJwtParsingError('JWT missing account_id claim');
            } else {
              setJwtParsingError(null);
            }
          } catch (parseError) {
            console.error('[JWT Check] Error parsing JWT payload:', parseError);
            setJwtParsingError(`JWT parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
            setJwtAccountId(null);
          }
        } else {
          console.warn('[JWT Check] No active session found');
          setJwtParsingError('No active session');
          setJwtAccountId(null);
        }
      } catch (error) {
        console.error('[JWT Check] Error checking JWT account_id:', error);
        setJwtParsingError(`JWT check error: ${error instanceof Error ? error.message : String(error)}`);
        setJwtAccountId(null);
      } finally {
        setJwtFetchAttempted(true);
      }
    };
    
    if (user && !jwtFetchAttempted) {
      checkJwtAccountId();
    }
  }, [user, jwtFetchAttempted]);

  // Fetch user accounts after JWT check
  useEffect(() => {
    const fetchUserAccounts = async () => {
      if (!user) {
        setUserAccounts([]);
        setSelectedAccount(null);
        return;
      }

      setIsLoadingAccounts(true);
      try {
        console.log('[Account Fetch] Fetching accounts for user:', user.id);
        
        // Use the direct function call endpoint instead of querying account_users table
        // This avoids the RLS recursion issue completely
        const { data: userAccountIds, error: accountIdsError } = await supabase
          .rpc('get_user_account_ids');

        if (accountIdsError) {
          // Show a slightly more friendly error when no accounts found
          // This is likely a permission issue due to missing JWT account_id
          if (accountIdsError.message.includes('permission denied')) {
            console.warn('[Account Fetch] Permission denied when fetching accounts');
            
            // Check whether this is due to missing account_id in JWT
            if (!jwtAccountId) {
              setUserAccounts([]);
              setIsLoadingAccounts(false);
              
              // This is expected if JWT is missing account_id
              console.warn('[Account Fetch] No accounts found - likely due to missing JWT account_id');
              return;
            }
          }
          
          console.error('[Account Fetch] Error fetching user account IDs:', accountIdsError);
          
          // Check if the error might be related to JWT issues
          if (jwtParsingError) {
            toast({
              title: "Account loading failed - JWT issue detected",
              description: "Your session token appears to be invalid. Please refresh your session.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Account loading error",
              description: `Failed to load accounts: ${accountIdsError.message}`,
              variant: "destructive",
            });
          }
          
          throw accountIdsError;
        }

        if (!userAccountIds || userAccountIds.length === 0) {
          console.warn('[Account Fetch] No accounts found for user');
          setUserAccounts([]);
          setIsLoadingAccounts(false);
          return;
        }

        console.log('[Account Fetch] Found account IDs:', userAccountIds);
        
        // Then get the account details for these IDs
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .in('id', userAccountIds);

        if (accountsError) {
          console.error('[Account Fetch] Error fetching accounts:', accountsError);
          throw accountsError;
        }
        
        if (!accountsData || accountsData.length === 0) {
          console.warn('[Account Fetch] No matching accounts found');
          setUserAccounts([]);
          setIsLoadingAccounts(false);
          return;
        }

        console.log('[Account Fetch] Found accounts:', accountsData);
        
        // Now get the roles for each account the user belongs to
        const combinedData: UserAccount[] = [];
        
        // For each account, fetch the user's role
        for (const account of accountsData) {
          const { data: roleData, error: roleError } = await supabase
            .from('account_users')
            .select('role')
            .eq('user_id', user.id)
            .eq('account_id', account.id)
            .maybeSingle();
            
          if (roleError) {
            console.error(`[Account Fetch] Error fetching role for account ${account.id}:`, roleError);
            continue;
          }
          
          if (roleData) {
            combinedData.push({
              id: account.id,
              account_id: account.id,
              user_id: user.id,
              role: roleData.role,
              account: account as Account
            });
          }
        }
        
        setUserAccounts(combinedData);
        
        // Account selection logic
        if (jwtAccountId && combinedData.some(ua => ua.account.id === jwtAccountId)) {
          const jwtAccount = combinedData.find(ua => ua.account.id === jwtAccountId)?.account || null;
          console.log('[Account Selection] Using JWT account_id:', jwtAccountId);
          setSelectedAccount(jwtAccount);
        } else if (selectedAccount) {
          const existingAccount = combinedData.find(acc => acc.account.id === selectedAccount.id)?.account;
          if (existingAccount) {
            console.log('[Account Selection] Keeping current account:', selectedAccount.id);
            setSelectedAccount(existingAccount);
          } else {
            console.log('[Account Selection] Current account no longer valid, using first available');
            setSelectedAccount(combinedData[0].account);
          }
        } else if (combinedData.length > 0) {
          console.log('[Account Selection] No account selected, using first available');
          setSelectedAccount(combinedData[0].account);
        }
      } catch (error) {
        console.error('[Account Fetch] Error fetching user accounts:', error);
        toast({
          title: "Account loading error",
          description: "Could not load your accounts. Please try refreshing or signing out and in again.",
          variant: "destructive",
        });
        setUserAccounts([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (user && jwtFetchAttempted) {
      fetchUserAccounts();
    }
  }, [user, jwtAccountId, jwtFetchAttempted, selectedAccount, jwtParsingError]);

  return { 
    userAccounts, 
    isLoadingAccounts, 
    currentAccount: selectedAccount,
    setCurrentAccount: setSelectedAccount,
    jwtAccountId, // Export this for debugging
    jwtParsingError // Export this for better error handling
  };
}
