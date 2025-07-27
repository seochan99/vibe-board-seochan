import { BoardElement } from '@/shared/types';

export interface RealTimeCollaborationModel {
  connectedUsers: string[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RealTimeCollaborationActions {
  subscribeToBoard: (boardId: string) => Promise<void>;
  unsubscribeFromBoard: (boardId: string) => Promise<void>;
  subscribeToElements: (boardId: string) => Promise<void>;
  unsubscribeFromElements: (boardId: string) => Promise<void>;
  setConnectedUsers: (users: string[]) => void;
  setIsConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 