import { Button } from "@/shared/ui";

interface HeroSectionProps {
  onGoogleLogin: () => void;
  onExplore: () => void;
}

export function HeroSection({ onGoogleLogin, onExplore }: HeroSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              아이디어를<br />
              <span className="text-black">실시간으로</span><br />
              공유하세요
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              미니멀리스트 온라인 화이트보드로 팀과 함께 아이디어를 발전시키고 
              실시간으로 협업하세요.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="primary"
              size="lg"
              onClick={onGoogleLogin}
              className="flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google로 시작하기</span>
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={onExplore}
              className="flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>보드 둘러보기</span>
            </Button>
          </div>
        </div>

        {/* Right Content - Mock Board */}
        <div className="relative">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500">Vibe Board</div>
            </div>
            
            <div className="space-y-4">
              {/* Mock Post-its */}
              <div className="flex space-x-4">
                <div className="bg-yellow-200 p-4 rounded-lg shadow-sm w-32 h-24 transform rotate-1">
                  <p className="text-sm font-medium text-gray-800">아이디어 1</p>
                  <p className="text-xs text-gray-600 mt-1">팀 미팅</p>
                </div>
                <div className="bg-blue-200 p-4 rounded-lg shadow-sm w-32 h-24 transform -rotate-1">
                  <p className="text-sm font-medium text-gray-800">아이디어 2</p>
                  <p className="text-xs text-gray-600 mt-1">프로젝트</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="bg-green-200 p-4 rounded-lg shadow-sm w-32 h-24 transform rotate-2">
                  <p className="text-sm font-medium text-gray-800">아이디어 3</p>
                  <p className="text-xs text-gray-600 mt-1">브레인스토밍</p>
                </div>
                <div className="bg-pink-200 p-4 rounded-lg shadow-sm w-32 h-24 transform -rotate-1">
                  <p className="text-sm font-medium text-gray-800">아이디어 4</p>
                  <p className="text-xs text-gray-600 mt-1">디자인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 