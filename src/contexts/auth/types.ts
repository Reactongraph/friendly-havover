
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface UserMetadata {
  [key: string]: any;
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
}

export interface Account {
  id: string;
  name: string;
}

export interface AccountWithRole {
  account: Account;
  role: string;
}

// Add the UserAccount interface that's missing
export interface UserAccount {
  id: string;
  account_id: string;
  user_id: string;
  role: string;
  account: Account;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userAccounts: AccountWithRole[];
  currentAccount: Account | null;
  isLoading: boolean;
  isLoadingAccounts: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  // Update to match the implementation - name parameter becomes metadata
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  setCurrentAccount: (account: Account) => void;
  jwtAccountId?: string | null;
  jwtParsingError?: boolean;
}
