"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../supabase/client";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 앱 시작 시 인증 상태 확인
        await checkAuth();

        // Supabase 세션 변경 구독
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            // 세션 변경 시 인증 상태 다시 확인
            await checkAuth();
          }
        );

        setIsInitialized(true);

        // 컴포넌트 언마운트 시 구독 해제
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    // 초기화를 한 번만 실행
    if (!isInitialized) {
      initializeAuth();
    }
  }, [checkAuth, isInitialized]);

  // 초기화가 완료되고 로딩이 끝나면 children 렌더링
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">앱 초기화 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 