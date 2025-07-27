import { User } from '@/shared/types';

export interface UserModel {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 