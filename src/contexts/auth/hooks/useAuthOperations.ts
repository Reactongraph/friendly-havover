
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Session, User } from '@supabase/supabase-js';

export function useAuthOperations(
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  clearAccountState: () => void
) {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Step 1: Create the user in Supabase Auth
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: name }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Step 2: Sign in the user to get a session immediately
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      // Get the user ID from the sign-in response
      const userId = signInData.user?.id;
      
      if (!userId) {
        throw new Error("Failed to get user ID after sign in");
      }
      
      // Step 3: Create a new account for the user
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .insert([{ name: `${name}'s Account` }])
        .select()
        .single();
      
      if (accountError) throw accountError;
      
      // Step 4: Link the user to the account
      const { error: accountUserError } = await supabase
        .from('account_users')
        .insert([{
          account_id: accountData.id,
          user_id: userId,
          role: 'admin'
        }]);
      
      if (accountUserError) throw accountUserError;
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      // Update the local state with the new session
      setSession(signInData.session);
      setUser(signInData.user);
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // First clear local state to prevent any race conditions
      setUser(null);
      setSession(null);
      clearAccountState();
      
      // Then perform the actual sign out - WITH ERROR HANDLING
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) {
          console.warn('Warning during sign out:', error);
          // We continue anyway because we already cleared the local state
        }
      } catch (signOutError) {
        // Handle specific Supabase auth errors
        console.warn('Could not perform server-side sign out:', signOutError);
        // This is non-critical - we'll continue with local cleanup
      }
      
      // Force clear any localStorage items that might be lingering
      localStorage.removeItem('supabase.auth.token');
      
      // Log successful client-side cleanup
      console.log('Session cleared locally, redirecting to auth page');
      
      // Navigate to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('Error in sign out process:', error);
      toast({
        title: "Sign out process encountered an issue",
        description: "Your session may not be completely cleared. Please close your browser for a complete sign out.",
        variant: "destructive",
      });
      // Still redirect to auth page even if there was an error
      navigate('/auth');
    }
  };

  return { signIn, signUp, signOut };
}
