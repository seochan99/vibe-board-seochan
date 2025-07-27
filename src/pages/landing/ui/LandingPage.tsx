"use client";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🎨 Vibe Board
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          아이디어를 실시간으로 공유하고 함께 발전시키는 미니멀리스트 온라인 화이트보드
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Google로 시작하기
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" onClick={() => {
            router.push('/board');
          }}>
            보드 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
} 