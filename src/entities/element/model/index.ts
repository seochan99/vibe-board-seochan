import { BoardElement } from '@/shared/types';

export interface BoardElementModel {
  elements: BoardElement[];
  selectedElement: BoardElement | null;
  isLoading: boolean;
  error: string | null;
}

export interface BoardElementActions {
  setElements: (elements: BoardElement[]) => void;
  addElement: (element: BoardElement) => void;
  updateElement: (element: BoardElement) => void;
  deleteElement: (elementId: string) => void;
  setSelectedElement: (element: BoardElement | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 