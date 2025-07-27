import { Logo, Button } from "@/shared/ui";
import { useAuthStore } from "@/shared/lib/stores";
import { useRouter } from "next/navigation";

interface NavigationProps {
  onExplore?: () => void;
  onLogin?: () => void;
  onCreateBoard?: () => void;
  boardCount?: number;
  variant?: 'landing' | 'dashboard';
}

export function Navigation({ 
  onExplore, 
  onLogin, 
  onCreateBoard, 
  boardCount, 
  variant = 'landing' 
}: NavigationProps) {
  const { user, isAnonymous, signOut, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="px-6 py-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div onClick={() => router.push('/')} className="cursor-pointer">
          <Logo size="md" />
        </div>
        <div className="flex items-center space-x-4">
          {variant === 'landing' ? (
            <>
              <button 
                onClick={onExplore}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                둘러보기
              </button>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url && (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name || user.email}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-600">{user.name || user.email}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="primary"
                  onClick={onLogin}
                >
                  로그인
                </Button>
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">
                총 {boardCount}개의 보드
              </span>
              {/* Only show create board button for authenticated users */}
              {user && !isAnonymous && (
                <Button onClick={onCreateBoard}>
                  새 보드 만들기
                </Button>
              )}
              {isAnonymous && (
                <span className="text-sm text-gray-500">
                  익명 사용자 - 공개 보드만 볼 수 있습니다
                </span>
              )}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url && (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name || user.email}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-600">{user.name || user.email}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    로그아웃
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 