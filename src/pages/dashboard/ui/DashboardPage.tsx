"use client";
import { useRouter } from "next/navigation";
import { useBoards } from "@/entities/board";
import { Navigation } from "@/shared/ui";
import { ProtectedRoute } from "@/shared/lib/components";
import {
  StatsSection,
  BoardsGrid,
  LoadingState,
  ErrorState,
  SortOptions,
  DashboardHeader
} from "@/features/dashboard";

export function DashboardPage() {
  const router = useRouter();
  const {
    pinnedBoards,
    regularBoards,
    isLoading,
    error,
    sortBy,
    setSortBy,
    createBoard,
    toggleStar,
    togglePin,
    deleteBoard
  } = useBoards();

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard({
        name: '새 보드',
        description: '새로운 아이디어를 위한 보드',
      });
      router.push(`/board/${newBoard.id}`);
    } catch (err) {
      console.error('보드 생성 실패:', err);
      // Show error message to user
      alert(err instanceof Error ? err.message : '보드 생성에 실패했습니다.');
    }
  };

  const handleOpenBoard = (boardId: string) => {
    router.push(`/board/${boardId}`);
  };

  const handleStarBoard = async (boardId: string) => {
    try {
      await toggleStar(boardId);
    } catch (err) {
      console.error('보드 즐겨찾기 실패:', err);
      alert(err instanceof Error ? err.message : '즐겨찾기 설정에 실패했습니다.');
    }
  };

  const handlePinBoard = async (boardId: string) => {
    try {
      await togglePin(boardId);
    } catch (err) {
      console.error('보드 고정 실패:', err);
      alert(err instanceof Error ? err.message : '고정 설정에 실패했습니다.');
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
    } catch (err) {
      console.error('보드 삭제 실패:', err);
      alert(err instanceof Error ? err.message : '보드 삭제에 실패했습니다.');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation
            variant="dashboard"
            boardCount={0}
            onCreateBoard={handleCreateBoard}
          />
          <LoadingState />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation
            variant="dashboard"
            boardCount={0}
            onCreateBoard={handleCreateBoard}
          />
          <ErrorState error={error} onRetry={handleRetry} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          variant="dashboard"
          boardCount={pinnedBoards.length + regularBoards.length}
          onCreateBoard={handleCreateBoard}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader onCreateBoard={handleCreateBoard} />
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <SortOptions
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            <StatsSection boards={[...pinnedBoards, ...regularBoards]} />
          </div>

          <BoardsGrid
            pinnedBoards={pinnedBoards}
            regularBoards={regularBoards}
            onCreateBoard={handleCreateBoard}
            onOpenBoard={handleOpenBoard}
            onStarBoard={handleStarBoard}
            onPinBoard={handlePinBoard}
            onDeleteBoard={handleDeleteBoard}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
} 