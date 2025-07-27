import { useState, useEffect, useMemo } from 'react';
import { Board } from '@/shared/types';
import { boardApi, CreateBoardData } from '@/entities/board/api';
import { useAuthStore } from '@/shared/lib/stores/authStore';

// Mock data for development (commented out)
/*
const mockBoards: Board[] = [
  { id: "1", name: "내 첫 프로젝트", description: "새로운 아이디어를 위한 첫 번째 보드", owner_id: "user1", owner_name: "김철수", element_count: 12, last_activity_at: "2024-01-15T14:30:00Z", created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T14:30:00Z", is_public: false, is_starred: true, is_pinned: false },
  { id: "2", name: "팀 브레인스토밍", description: "팀과 함께하는 아이디어 회의", owner_id: "user1", owner_name: "김철수", element_count: 8, last_activity_at: "2024-01-14T16:45:00Z", created_at: "2024-01-10T09:00:00Z", updated_at: "2024-01-14T16:45:00Z", is_public: true, is_starred: false, is_pinned: true },
  { id: "3", name: "디자인 시스템", description: "UI/UX 디자인 가이드라인", owner_id: "user1", owner_name: "김철수", element_count: 15, last_activity_at: "2024-01-13T11:20:00Z", created_at: "2024-01-08T14:00:00Z", updated_at: "2024-01-13T11:20:00Z", is_public: false, is_starred: false, is_pinned: false },
  { id: "4", name: "마케팅 전략", description: "2024년 마케팅 전략 수립", owner_id: "user1", owner_name: "김철수", element_count: 6, last_activity_at: "2024-01-12T09:15:00Z", created_at: "2024-01-05T11:00:00Z", updated_at: "2024-01-12T09:15:00Z", is_public: false, is_starred: true, is_pinned: true },
];
*/

export type SortOption = 'recent' | 'name' | 'activity' | 'created';

export function useBoards() {
  const { user, isAnonymous } = useAuthStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Fetch boards from API
  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await boardApi.getBoards();
      setBoards(data);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
      if (err instanceof Error) {
        if (err.message.includes('User not authenticated')) {
          setError('로그인이 필요합니다.');
        } else {
          setError('보드를 불러오는데 실패했습니다.');
        }
      } else {
        setError('보드를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [isAnonymous]);

  // Sort boards based on selected option
  const sortedBoards = useMemo(() => {
    const sorted = [...boards];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'activity':
        return sorted.sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
      case 'created':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sorted;
    }
  }, [boards, sortBy]);

  // Separate pinned and regular boards
  const pinnedBoards = useMemo(() => {
    return sortedBoards.filter(board => board.is_pinned);
  }, [sortedBoards]);

  const regularBoards = useMemo(() => {
    return sortedBoards.filter(board => !board.is_pinned);
  }, [sortedBoards]);

  // Create new board
  const createBoard = async (boardData: CreateBoardData) => {
    try {
      // Anonymous users cannot create boards
      if (isAnonymous) {
        throw new Error('익명 사용자는 보드를 생성할 수 없습니다. 로그인 후 다시 시도해주세요.');
      }
      
      const newBoard = await boardApi.createBoard(boardData);
      setBoards(prev => [newBoard, ...prev]);
      return newBoard;
    } catch (err) {
      console.error('Failed to create board:', err);
      setError('보드 생성에 실패했습니다.');
      throw err;
    }
  };

  // Toggle star
  const toggleStar = async (boardId: string) => {
    try {
      // Anonymous users cannot modify boards
      if (isAnonymous) {
        throw new Error('익명 사용자는 보드를 수정할 수 없습니다.');
      }
      
      const updatedBoard = await boardApi.toggleStar(boardId);
      setBoards(prev => prev.map(board => board.id === boardId ? updatedBoard : board));
    } catch (err) {
      console.error('Failed to toggle star:', err);
      setError('즐겨찾기 설정에 실패했습니다.');
      throw err;
    }
  };

  // Toggle pin
  const togglePin = async (boardId: string) => {
    try {
      // Anonymous users cannot modify boards
      if (isAnonymous) {
        throw new Error('익명 사용자는 보드를 수정할 수 없습니다.');
      }
      
      const updatedBoard = await boardApi.togglePin(boardId);
      setBoards(prev => prev.map(board => board.id === boardId ? updatedBoard : board));
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      setError('고정 설정에 실패했습니다.');
      throw err;
    }
  };

  // Delete board
  const deleteBoard = async (boardId: string) => {
    try {
      // Anonymous users cannot delete boards
      if (isAnonymous) {
        throw new Error('익명 사용자는 보드를 삭제할 수 없습니다.');
      }
      
      await boardApi.deleteBoard(boardId);
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (err) {
      console.error('Failed to delete board:', err);
      setError('보드 삭제에 실패했습니다.');
      throw err;
    }
  };

  // Update board
  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    try {
      const updatedBoard = await boardApi.updateBoard(boardId, updates);
      setBoards(prev => prev.map(board => board.id === boardId ? updatedBoard : board));
      return updatedBoard;
    } catch (err) {
      console.error('Failed to update board:', err);
      setError('보드 업데이트에 실패했습니다.');
      throw err;
    }
  };

  return {
    boards: sortedBoards,
    pinnedBoards,
    regularBoards,
    isLoading,
    error,
    sortBy,
    setSortBy,
    createBoard,
    deleteBoard,
    updateBoard,
    toggleStar,
    togglePin,
    refetch: fetchBoards
  };
} 