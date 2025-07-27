import { User } from '@/shared/types';

export interface AuthModel {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 