import { supabase } from '@/shared/lib/supabase/client';
import { Board } from '@/shared/types';

export interface CreateBoardData {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateBoardData {
  name?: string;
  description?: string;
  is_public?: boolean;
  is_starred?: boolean;
  is_pinned?: boolean;
}

export interface BoardAccess {
  board_id: string;
  user_id: string;
  access_type: 'owner' | 'viewer' | 'editor';
  created_at: string;
}

export const boardApi = {
  // Get all boards for current user (including shared boards)
  async getBoards(): Promise<Board[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get owned boards
      const { data: ownedBoards, error: ownedError } = await supabase
        .from('boards')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Get shared boards
      const { data: sharedBoards, error: sharedError } = await supabase
        .from('board_access')
        .select(`
          board_id,
          boards (*)
        `)
        .eq('user_id', user.id)
        .neq('access_type', 'owner');

      if (sharedError) throw sharedError;

      const allBoards = [
        ...(ownedBoards || []),
        ...(sharedBoards?.map(sb => sb.boards).filter(Boolean) || [])
      ];

      return allBoards.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else {
      // For anonymous users, only return public boards
      const { data: publicBoards, error: publicError } = await supabase
        .from('boards')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false });

      if (publicError) throw publicError;
      return publicBoards || [];
    }
  },

  // Get single board by ID (check access)
  async getBoard(boardId: string): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if user owns the board
    if (user) {
      const { data: ownedBoard, error: ownedError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .eq('owner_id', user.id)
        .single();

      if (ownedBoard) return ownedBoard;

      // Check if user has access to the board
      const { data: access, error: accessError } = await supabase
        .from('board_access')
        .select('*')
        .eq('board_id', boardId)
        .eq('user_id', user.id)
        .single();

      if (access) {
        // Get board data
        const { data: board, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .eq('id', boardId)
          .single();

        if (boardError) throw boardError;
        return board;
      }
    }

    // Check if board is public (for anonymous users)
    const { data: publicBoard, error: publicError } = await supabase
      .from('boards')
      .select('*')
      .eq('id', boardId)
      .eq('is_public', true)
      .single();

    if (publicError || !publicBoard) {
      throw new Error('Board not found or access denied');
    }

    return publicBoard;
  },

  // Create new board
  async createBoard(boardData: CreateBoardData): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다. 보드를 생성하려면 먼저 로그인해주세요.');

    const { data, error } = await supabase
      .from('boards')
      .insert({
        ...boardData,
        owner_id: user.id,
        owner_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update board
  async updateBoard(boardId: string, updates: UpdateBoardData): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete board
  async deleteBoard(boardId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', boardId)
      .eq('owner_id', user.id);

    if (error) throw error;
  },

  // Toggle star status
  async toggleStar(boardId: string): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get current board
    const { data: currentBoard, error: fetchError } = await supabase
      .from('boards')
      .select('is_starred')
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle star status
    const { data, error } = await supabase
      .from('boards')
      .update({ is_starred: !currentBoard.is_starred })
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Toggle pin status
  async togglePin(boardId: string): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get current board
    const { data: currentBoard, error: fetchError } = await supabase
      .from('boards')
      .select('is_pinned')
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle pin status
    const { data, error } = await supabase
      .from('boards')
      .update({ is_pinned: !currentBoard.is_pinned })
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Generate invite code for board
  async generateInviteCode(boardId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user owns the board
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .single();

    if (boardError || !board) {
      throw new Error('Board not found or access denied');
    }

    // Check if there's already a valid invite code for this board
    const { data: existingInvite, error: inviteError } = await supabase
      .from('board_invites')
      .select('invite_code')
      .eq('board_id', boardId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existingInvite) {
      return existingInvite.invite_code;
    }

    // Generate new invite code - URL safe version
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let inviteCode = generateCode();
    
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('board_invites')
        .select('id')
        .eq('invite_code', inviteCode)
        .single();
      
      if (!existing) break;
      inviteCode = generateCode();
      attempts++;
    }
    
    // Store invite code in database
    const { error: insertError } = await supabase
      .from('board_invites')
      .upsert({
        board_id: boardId,
        invite_code: inviteCode,
        created_by: user.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

    if (insertError) throw insertError;
    return inviteCode;
  },

  // Join board with invite code
  async joinBoardWithInvite(inviteCode: string): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser();

    console.log('Joining board with invite code:', inviteCode);

    // Find invite with more detailed logging
    const { data: invite, error: inviteError } = await supabase
      .from('board_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .gt('expires_at', new Date().toISOString())
      .single();

    console.log('Invite lookup result:', { 
      inviteCode, 
      invite, 
      inviteError, 
      currentTime: new Date().toISOString(),
      query: `SELECT * FROM board_invites WHERE invite_code = '${inviteCode}' AND expires_at > '${new Date().toISOString()}'`
    });

    if (inviteError) {
      console.error('Invite lookup error details:', {
        code: inviteError.code,
        message: inviteError.message,
        details: inviteError.details,
        hint: inviteError.hint
      });
      throw new Error('Invalid or expired invite code');
    }

    if (!invite) {
      console.error('No invite found for code:', inviteCode);
      throw new Error('Invalid or expired invite code');
    }

    console.log('Found valid invite:', invite);

    // If user is authenticated, add them to board access
    if (user) {
      console.log('Adding authenticated user to board access:', { userId: user.id, boardId: invite.board_id });
      
      const { error: accessError } = await supabase
        .from('board_access')
        .upsert({
          board_id: invite.board_id,
          user_id: user.id,
          access_type: 'viewer'
        });

      if (accessError) {
        console.warn('Failed to add user to board access:', accessError);
        // Continue anyway for anonymous users
      } else {
        console.log('Successfully added user to board access');
      }
    } else {
      console.log('No authenticated user, proceeding as anonymous');
    }

    // Get board data
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('*')
      .eq('id', invite.board_id)
      .single();

    console.log('Board lookup result:', { board, boardError });

    if (boardError) {
      console.error('Failed to get board data:', boardError);
      throw boardError;
    }
    
    console.log('Successfully joined board:', board);
    return board;
  }
}; 