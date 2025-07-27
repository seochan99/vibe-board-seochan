import { supabase } from '@/shared/lib/supabase/client';
import { BoardElement } from '@/shared/types';
import { useAuthStore } from '@/shared/lib/stores/authStore';

// Generate UUID for anonymous users
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface CreateElementData {
  board_id: string;
  user_id: string;
  type: 'postit' | 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  image_url?: string;
}

export interface UpdateElementData {
  content?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  color?: string;
  image_url?: string;
}

export const elementApi = {
  // Get elements by board ID with user information
  async getElementsByBoardId(boardId: string): Promise<BoardElement[]> {
    const { data, error } = await supabase
      .from('board_elements')
      .select(`
        *,
        users!board_elements_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('board_id', boardId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Get current user for anonymous user detection
    const { data: { user } } = await supabase.auth.getUser();
    
    // Transform the data to include user name
    return (data || []).map(element => {
      let userName = 'Anonymous';
      
      if (element.users) {
        // User exists in users table
        userName = element.users.name || element.users.email?.split('@')[0] || 'Anonymous';
      } else {
        // This is likely an anonymous user
        if (user && element.user_id === user.id) {
          userName = '나 (익명)';
        } else {
          userName = 'Anonymous';
        }
      }
      
      return {
        ...element,
        userName
      };
    });
  },

  // Get board elements (alias for getElementsByBoardId)
  async getBoardElements(boardId: string): Promise<BoardElement[]> {
    const { data, error } = await supabase
      .from('board_elements')
      .select(`
        *,
        users!board_elements_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('board_id', boardId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Get current user for anonymous user detection
    const { data: { user } } = await supabase.auth.getUser();
    
    // Transform the data to include user name
    return (data || []).map(element => {
      let userName = 'Anonymous';
      
      if (element.users) {
        // User exists in users table
        userName = element.users.name || element.users.email?.split('@')[0] || 'Anonymous';
      } else {
        // This is likely an anonymous user
        if (user && element.user_id === user.id) {
          userName = '나 (익명)';
        } else {
          userName = 'Anonymous';
        }
      }
      
      return {
        ...element,
        userName
      };
    });
  },

  // Create new element
  async createElement(elementData: CreateElementData): Promise<BoardElement> {
    // For anonymous users, ensure we have a valid user_id
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || elementData.user_id || crypto.randomUUID();
    
    const elementDataWithUserId = {
      ...elementData,
      user_id: userId
    };

    const { data, error } = await supabase
      .from('board_elements')
      .insert(elementDataWithUserId)
      .select(`
        *,
        users!board_elements_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Failed to create element:', error);
      throw error;
    }
    
    // Transform the data to include user name
    let userName = 'Anonymous';
    
    if (data.users) {
      // User exists in users table
      userName = data.users.name || data.users.email?.split('@')[0] || 'Anonymous';
    } else {
      // This is likely an anonymous user
      if (user && data.user_id === user.id) {
        userName = '나 (익명)';
      } else {
        userName = 'Anonymous';
      }
    }
    
    return {
      ...data,
      userName
    };
  },

  // Update element
  async updateElement(elementId: string, updates: UpdateElementData): Promise<BoardElement> {
    const { data, error } = await supabase
      .from('board_elements')
      .update(updates)
      .eq('id', elementId)
      .select(`
        *,
        users!board_elements_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) throw error;
    
    // Get current user for anonymous user detection
    const { data: { user } } = await supabase.auth.getUser();
    
    // Transform the data to include user name
    let userName = 'Anonymous';
    
    if (data.users) {
      // User exists in users table
      userName = data.users.name || data.users.email?.split('@')[0] || 'Anonymous';
    } else {
      // This is likely an anonymous user
      if (user && data.user_id === user.id) {
        userName = '나 (익명)';
      } else {
        userName = 'Anonymous';
      }
    }
    
    return {
      ...data,
      userName
    };
  },

  // Delete element
  async deleteElement(elementId: string): Promise<void> {
    const { error } = await supabase
      .from('board_elements')
      .delete()
      .eq('id', elementId);

    if (error) throw error;
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, boardId: string): Promise<string> {
    console.log('uploadImage', boardId, file);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${boardId}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('board-image')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('board-image')
        .getPublicUrl(filePath);

      console.log('Public URL retrieved:', publicUrl);

      return publicUrl;
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('row-level security policy')) {
        console.error('This is a permissions issue. Check your RLS policies for the storage bucket.');
      }
      throw error;
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Get boardId/filename

    const { error } = await supabase.storage
      .from('board-image')
      .remove([filePath]);

    if (error) throw error;
  }
}; 