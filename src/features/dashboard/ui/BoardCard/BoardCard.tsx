import { useState } from 'react';
import { Board } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BoardCardProps {
  board: Board;
  onOpen: (boardId: string) => void;
  onStar: (boardId: string) => void;
  onPin: (boardId: string) => void;
  onDelete: (boardId: string) => void;
}

export function BoardCard({ board, onOpen, onStar, onPin, onDelete }: BoardCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStar(board.id);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin(board.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(board.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group relative"
        onClick={() => onOpen(board.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
              {board.name}
            </h3>
            {board.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {board.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={handleStarClick}
              className={`p-1 rounded transition-colors ${
                board.is_starred 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
              title={board.is_starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <svg className="w-5 h-5" fill={board.is_starred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button
              onClick={handlePinClick}
              className={`p-1 rounded transition-colors ${
                board.is_pinned 
                  ? 'text-blue-500 hover:text-blue-600' 
                  : 'text-gray-400 hover:text-blue-500'
              }`}
              title={board.is_pinned ? '고정 해제' : '고정하기'}
            >
              <svg className="w-5 h-5" fill={board.is_pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 rounded transition-colors text-gray-400 hover:text-red-500"
              title="삭제"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {board.element_count}개 요소
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {board.owner_name}
            </span>
          </div>
          <span>
            {formatDistanceToNow(new Date(board.last_activity_at), { 
              addSuffix: true, 
              locale: ko 
            })}
          </span>
        </div>

        {board.is_public && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              공개
            </span>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">보드 삭제</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <strong>&ldquo;{board.name}&rdquo;</strong> 보드를 삭제하시겠습니까?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                이 작업은 되돌릴 수 없으며, 보드의 모든 내용이 영구적으로 삭제됩니다.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 