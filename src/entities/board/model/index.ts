import { Board } from '@/shared/types';

export interface BoardModel {
  board: Board | null;
  boards: Board[];
  isLoading: boolean;
  error: string | null;
}

export interface BoardActions {
  setBoard: (board: Board | null) => void;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 