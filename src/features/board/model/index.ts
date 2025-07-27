import { Board } from '@/shared/types';

export interface BoardManagementModel {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
}

export interface BoardManagementActions {
  createBoard: (name: string) => Promise<Board>;
  getBoards: () => Promise<Board[]>;
  getBoard: (boardId: string) => Promise<Board>;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<Board>;
  deleteBoard: (boardId: string) => Promise<void>;
  setCurrentBoard: (board: Board | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 