"use client";
import { useRouter } from "next/navigation";
import { Navigation } from "@/shared/ui";
import { HeroSection, FeaturesSection, Footer } from "@/features/landing";
import { useAuthStore } from "@/shared/lib/stores";
import { useEffect } from "react";

export function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // 로그인된 사용자가 랜딩 페이지에 접근하면 대시보드로 리다이렉트
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleGoogleLogin = () => {
    router.push('/auth');
  };

  const handleExplore = () => {
    router.push('/dashboard');
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  // 로딩 중이거나 로그인된 사용자라면 로딩 화면 표시
  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? '로딩 중...' : '대시보드로 이동 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        variant="landing"
        onExplore={handleExplore}
        onLogin={handleLogin}
      />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            실시간 협업 화이트보드
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            팀과 함께 아이디어를 발전시키고 실시간으로 소통하세요
          </p>
        </div>
        
        <HeroSection 
          onGoogleLogin={handleLogin}
          onExplore={handleExplore}
        />
      </div>

      <FeaturesSection />
      
      <Footer />
    </div>
  );
} 