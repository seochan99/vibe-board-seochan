import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';

interface DashboardHeaderProps {
  onCreateBoard: () => void;
}

export function DashboardHeader({ onCreateBoard }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">보드를 생성하고 관리하세요</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={() => router.push('/board/join')}
        >
          초대 코드로 참여
        </Button>
        <Button
          onClick={onCreateBoard}
        >
          새 보드 만들기
        </Button>
      </div>
    </div>
  );
} 