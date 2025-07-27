"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoardCanvas } from "@/features/board";
import { BoardHeader, BoardSidebar, BoardCanvas } from "@/features/board";
import { boardApi } from '@/entities/board/api';
import { useAuthStore } from '@/shared/lib/stores/authStore';

export function BoardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, checkAuth, sessionId } = useAuthStore();
  
  const {
    canvasRef,
    board,
    setBoard,
    cursors,
    elements,
    isLoading: boardLoading,
    error,
    selectedTool,
    setSelectedTool,
    selectedColor,
    setSelectedColor,
    handleAddElement,
    handleElementMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementUpdate,
    handleElementDelete,
    canvasOffset,
    setCanvasOffset,
    scale,
    setScale,
  } = useBoardCanvas();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update title and description when board data loads
  useEffect(() => {
    if (board) {
      setTitle(board.name || '');
      setDescription(board.description || '');
    }
  }, [board]);

  // 강화된 인증 상태 확인 (공개 보드 허용)
  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !authLoading) {
        await checkAuth();
      }
    };
    verifyAuth();
  }, [user, authLoading, checkAuth]);

  const handleCanvasClick = () => {
    if (selectedTool) {
      handleAddElement(selectedTool);
    }
  };

  const handleTitleSave = async () => {
    if (!board) return;
    
    try {
      const updatedBoard = await boardApi.updateBoard(board.id, { name: title });
      // Update local board state to reflect changes immediately
      setBoard(updatedBoard);
      setIsEditingTitle(false);
    } catch (err) {
      console.error('Failed to update board title:', err);
    }
  };

  const handleDescriptionSave = async () => {
    if (!board) return;
    
    try {
      const updatedBoard = await boardApi.updateBoard(board.id, { description });
      // Update local board state to reflect changes immediately
      setBoard(updatedBoard);
      setIsEditingDescription(false);
    } catch (err) {
      console.error('Failed to update board description:', err);
    }
  };

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // 보드 로딩 중
  if (boardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // Calculate total participants including current user (same logic as BoardSidebar)
  const currentUserInList = cursors.find(c => c.userId === (user?.id || sessionId));
  const totalParticipants = cursors.length + (currentUserInList ? 0 : 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">홈</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">대시보드</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {user.name?.[0] || user.email?.[0] || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{user.name || user.email}</span>
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>

      <BoardHeader
        board={board}
        cursorsCount={totalParticipants}
        elementsCount={elements.length}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        title={title}
        setTitle={setTitle}
        onTitleSave={handleTitleSave}
        isEditingDescription={isEditingDescription}
        setIsEditingDescription={setIsEditingDescription}
        description={description}
        setDescription={setDescription}
        onDescriptionSave={handleDescriptionSave}
      />
      
      <div className="flex h-[calc(100vh-73px-57px)]">
        <BoardSidebar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          cursors={cursors}
          boardId={board?.id || ''}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          onAddImageToCanvas={(imageUrl, fileName) => {
            // Add image to canvas at current mouse position or center
            handleAddElement('image', imageUrl);
          }}
        />
        
        <BoardCanvas
          boardId={board?.id || ''}
          canvasRef={canvasRef}
          cursors={cursors}
          elements={elements}
          selectedTool={selectedTool}
          onElementMouseDown={handleElementMouseDown}
          onCanvasMouseMove={handleCanvasMouseMove}
          onCanvasMouseUp={handleCanvasMouseUp}
          onCanvasClick={handleCanvasClick}
          onToolSelect={setSelectedTool}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onAddElement={handleAddElement}
          canvasOffset={canvasOffset}
          setCanvasOffset={setCanvasOffset}
          scale={scale}
          setScale={setScale}
        />
      </div>
    </div>
  );
} 