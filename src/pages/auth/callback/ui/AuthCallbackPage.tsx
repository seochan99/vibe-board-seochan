"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/lib/stores";

export function AuthCallbackPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        await checkAuth();
        router.push('/dashboard');
      } catch (error) {
        console.error('인증 콜백 처리 중 오류:', error);
        router.push('/auth?error=auth_callback_failed');
      }
    };

    handleAuthCallback();
  }, [checkAuth, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
} 