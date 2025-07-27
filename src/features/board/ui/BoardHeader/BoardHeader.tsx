import { useState } from 'react';
import { Board } from '@/shared/types';
import { boardApi } from '@/entities/board/api';
import { useAuthStore } from '@/shared/lib/stores/authStore';
import { Toast } from '@/shared/ui/components';

interface BoardHeaderProps {
  board: Board | null;
  cursorsCount: number;
  elementsCount: number;
  isEditingTitle: boolean;
  setIsEditingTitle: (editing: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  onTitleSave: () => void;
  isEditingDescription: boolean;
  setIsEditingDescription: (editing: boolean) => void;
  description: string;
  setDescription: (description: string) => void;
  onDescriptionSave: () => void;
}

export function BoardHeader({
  board,
  cursorsCount,
  elementsCount,
  isEditingTitle,
  setIsEditingTitle,
  title,
  setTitle,
  onTitleSave,
  isEditingDescription,
  setIsEditingDescription,
  description,
  setDescription,
  onDescriptionSave
}: BoardHeaderProps) {
  const { user } = useAuthStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [showPublicToggle, setShowPublicToggle] = useState(false);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isOwner = board?.owner_id === user?.id;

  const handleGenerateInvite = async () => {
    if (!board) return;
    
    try {
      setIsGeneratingInvite(true);
      const code = await boardApi.generateInviteCode(board.id);
      setInviteCode(code);
    } catch (err) {
      console.error('Failed to generate invite code:', err);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!board) return;
    
    try {
      setIsUpdatingPublic(true);
      await boardApi.updateBoard(board.id, { is_public: !board.is_public });
      // Update local board state
      if (board) {
        board.is_public = !board.is_public;
      }
    } catch (err) {
      console.error('Failed to update board public status:', err);
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setToast({ message: '초대 코드가 클립보드에 복사되었습니다.', type: 'success' });
    } catch (err) {
      setToast({ message: '복사에 실패했습니다. 수동으로 복사해주세요.', type: 'error' });
    }
  };

  const copyInviteLink = async () => {
    try {
      const inviteLink = `${window.location.origin}/board/join?code=${inviteCode}`;
      await navigator.clipboard.writeText(inviteLink);
      setToast({ message: '초대 링크가 클립보드에 복사되었습니다.', type: 'success' });
    } catch (err) {
      setToast({ message: '복사에 실패했습니다. 수동으로 복사해주세요.', type: 'error' });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center space-x-3 mb-2">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onTitleSave();
                    } else if (e.key === 'Escape') {
                      setIsEditingTitle(false);
                    }
                  }}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                  autoFocus
                />
                <button
                  onClick={onTitleSave}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-bold text-gray-900 hover:text-black transition-colors"
              >
                {board?.name || '제목 없음'}
              </button>
            )}
            
            {/* Public/Private Badge */}
            {board && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                board.is_public 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {board.is_public ? '공개' : '비공개'}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex items-center space-x-3">
            {isEditingDescription ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onDescriptionSave();
                    } else if (e.key === 'Escape') {
                      setIsEditingDescription(false);
                    }
                  }}
                  placeholder="보드 설명을 입력하세요"
                  className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                  autoFocus
                />
                <button
                  onClick={onDescriptionSave}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingDescription(false)}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                {board?.description || '설명 추가'}
              </button>
            )}
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center space-x-6">
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{cursorsCount}명 참여</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{elementsCount}개 요소</span>
            </div>
          </div>

          {/* Actions */}
          {isOwner && (
            <div className="flex items-center space-x-2">
              {/* Public/Private Toggle */}
              <button
                onClick={handleTogglePublic}
                disabled={isUpdatingPublic}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-[#333]"
              >
                {isUpdatingPublic ? '업데이트 중...' : (board?.is_public ? '비공개로 변경' : '공개로 변경')}
              </button>

              {/* Invite Button */}
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1 text-sm bg-black text-white rounded-md hover:bg-gray-800"
              >
                초대하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">보드 초대</h3>
            
            {!inviteCode ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  초대 코드를 생성하여 다른 사람과 보드를 공유하세요.
                </p>
                <button
                  onClick={handleGenerateInvite}
                  disabled={isGeneratingInvite}
                  className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isGeneratingInvite ? '생성 중...' : '초대 코드 생성'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                   아래 코드를 복사하여 다른 사람과 공유하세요:
                 </p>
                 <div className="flex items-center space-x-2 mb-4">
                   <input
                     type="text"
                     value={inviteCode}
                     readOnly
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[#333]"
                   />
                   <button
                     onClick={copyInviteCode}
                     className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-[#333]"
                   >
                     복사
                   </button>
                 </div>
                 
                 <p className="text-sm text-gray-600 mb-4">
                   또는 아래 링크를 복사하여 공유하세요:
                 </p>
                 <div className="flex items-center space-x-2 mb-4">
                   <input
                     type="text"
                     value={`${window.location.origin}/board/join?code=${inviteCode}`}
                     readOnly
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs text-[#333]"
                   />
                   <button
                     onClick={copyInviteLink}
                     className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-[#333]"
                   >
                     링크 복사
                   </button>
                 </div>
                 <p className="text-xs text-gray-500">
                   초대 코드는 24시간 후 만료됩니다.
                 </p>
               </div>
             )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteCode('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 