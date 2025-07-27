import { BoardElement, Position, Size } from '@/shared/types';

export interface ContentCreationModel {
  selectedTool: 'note' | 'image' | null;
  isLoading: boolean;
  error: string | null;
}

export interface ContentCreationActions {
  createNote: (boardId: string, content: string, position: Position, color?: string) => Promise<BoardElement>;
  createImage: (boardId: string, imageUrl: string, position: Position, size: Size) => Promise<BoardElement>;
  updateElement: (elementId: string, updates: Partial<BoardElement>) => Promise<BoardElement>;
  deleteElement: (elementId: string) => Promise<void>;
  setSelectedTool: (tool: 'note' | 'image' | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 