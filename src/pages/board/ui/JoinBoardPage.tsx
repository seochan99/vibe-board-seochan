"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { boardApi } from '@/entities/board/api';
import { useAuthStore } from '@/shared/lib/stores/authStore';

export function JoinBoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleInviteCode = async () => {
      const inviteCode = searchParams?.get('code');
      
      console.log('Processing invite code:', inviteCode);
      
      if (!inviteCode) {
        setError('초대 코드가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Attempting to join board with invite code:', inviteCode);
        
        // Join board with invite code
        const boardData = await boardApi.joinBoardWithInvite(inviteCode);
        
        console.log('Successfully joined board:', boardData);
        
        // Redirect to the actual board page
        router.replace(`/board/${boardData.id}`);
      } catch (err) {
        console.error('Failed to join board with invite code:', err);
        
        // More specific error messages
        let errorMessage = '유효하지 않거나 만료된 초대 코드입니다.';
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            inviteCode: inviteCode
          });
          
          if (err.message.includes('Invalid or expired invite code')) {
            errorMessage = '유효하지 않거나 만료된 초대 코드입니다.';
          } else if (err.message.includes('not found')) {
            errorMessage = '보드를 찾을 수 없습니다.';
          } else {
            errorMessage = `오류가 발생했습니다: ${err.message}`;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    // 강화된 인증 상태 확인
    const verifyAuth = async () => {
      if (!user && !authLoading) {
        console.log('Checking auth status...');
        await checkAuth();
      }
    };

    const initialize = async () => {
      try {
        await verifyAuth();
        await handleInviteCode();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('초기화 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initialize();
  }, [searchParams, router, user, authLoading, checkAuth]);

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

  // 초대 코드 처리 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">보드에 참여하는 중...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">초대 코드 오류</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            대시보드로 이동
          </button>
        </div>
      </div>
    );
  }

  return null;
} 