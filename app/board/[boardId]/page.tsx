import { BoardPage } from '@/pages/board';

interface BoardPageRouteProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardPageRoute({ params }: BoardPageRouteProps) {
  await params; // params를 사용하지 않지만 await는 필요
  return <BoardPage />;
} 