"use client";
import { useRouter } from "next/navigation";

export function BoardPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 홈으로 돌아가기
          </button>
          <h1 className="text-xl font-semibold text-gray-900">🎨 Vibe Board</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
              저장
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              공유
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-60px)]">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🛠️ 도구</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                📝 포스트잇 추가
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                🖼️ 이미지 추가
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">색상 팔레트</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="w-8 h-8 bg-yellow-200 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-pink-200 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-green-200 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-blue-200 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-purple-200 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-orange-200 rounded cursor-pointer"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 메인 캔버스 */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-white">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🎨 보드 캔버스
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  여기에 포스트잇과 이미지를 추가하여 아이디어를 표현해보세요
                </p>
                <div className="space-x-4">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors">
                    📝 포스트잇 추가
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    🖼️ 이미지 추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 