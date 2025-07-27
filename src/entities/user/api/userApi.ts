import { supabase } from '@/shared/lib/supabase/client';
import { User } from '@/shared/types';

export interface UpdateUserData {
  name?: string;
  avatar_url?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export const userApi = {
  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // If user doesn't exist in public.users, create profile
      if (error.code === 'PGRST116') {
        return await this.createUserProfile(user);
      }
      throw error;
    }

    return data;
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw error;
    }

    return data;
  },

  // Create user profile
  async createUserProfile(authUser: AuthUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Anonymous',
        avatar_url: authUser.user_metadata?.avatar_url
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(updates: UpdateUserData): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 