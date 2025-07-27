import { Board } from '@/shared/types';

export interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
  lastSeen?: number;
}

// Local BoardElement type for UI components
export interface BoardElement {
  id: string;
  type: 'postit' | 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color?: string;
  userId: string;
  userName: string;
  image_url?: string;
}

export interface BoardState {
  cursors: CursorPosition[];
  elements: BoardElement[];
  selectedTool: 'postit' | 'image' | 'text' | null;
  isDragging: boolean;
  dragElement: BoardElement | null;
  mousePosition: { x: number; y: number };
}

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