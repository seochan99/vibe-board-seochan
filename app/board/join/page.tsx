import { Suspense } from 'react';
import { JoinBoardPage } from '@/pages/board/ui/JoinBoardPage';

export default function JoinBoardRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <JoinBoardPage />
    </Suspense>
  );
} 