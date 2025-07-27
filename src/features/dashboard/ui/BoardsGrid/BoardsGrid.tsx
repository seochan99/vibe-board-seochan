import { Board } from '@/shared/types';
import { BoardCard } from '../BoardCard';

interface BoardsGridProps {
  pinnedBoards: Board[];
  regularBoards: Board[];
  onCreateBoard: () => void;
  onOpenBoard: (boardId: string) => void;
  onStarBoard: (boardId: string) => void;
  onPinBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
}

export function BoardsGrid({ 
  pinnedBoards, 
  regularBoards, 
  onCreateBoard, 
  onOpenBoard, 
  onStarBoard, 
  onPinBoard,
  onDeleteBoard
}: BoardsGridProps) {
  return (
    <div className="space-y-8">
      {/* Pinned Boards */}
      {pinnedBoards.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">고정된 보드</h2>
            <span className="ml-2 text-sm text-gray-500">({pinnedBoards.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onOpen={onOpenBoard}
                onStar={onStarBoard}
                onPin={onPinBoard}
                onDelete={onDeleteBoard}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Boards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">모든 보드</h2>
            <span className="ml-2 text-sm text-gray-500">({regularBoards.length})</span>
          </div>
        </div>
        
        {regularBoards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">보드가 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 보드를 만들어보세요!</p>
            <button
              onClick={onCreateBoard}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 보드 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onOpen={onOpenBoard}
                onStar={onStarBoard}
                onPin={onPinBoard}
                onDelete={onDeleteBoard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 