"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/stores";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRedirect({ 
  children, 
  redirectTo = '/' 
}: AuthRedirectProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 로딩이 완료되고 사용자가 있으면 리다이렉트
    if (!isLoading && user) {
      router.replace(redirectTo);
    } else if (!isLoading) {
      setIsChecking(false);
    }
  }, [user, isLoading, router, redirectTo]);

  // 로딩 중이거나 체크 중일 때
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // 사용자가 없으면 자식 컴포넌트 렌더링
  if (!user) {
    return <>{children}</>;
  }

  // 사용자가 있으면 로딩 화면 표시 (리다이렉트 중)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">리다이렉트 중...</p>
      </div>
    </div>
  );
} 