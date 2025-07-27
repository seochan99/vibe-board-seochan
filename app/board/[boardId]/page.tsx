import { BoardPage } from '@/pages/board';

interface BoardPageRouteProps {
  params: {
    boardId: string;
  };
}

export default function BoardPageRoute({ params }: BoardPageRouteProps) {
  return <BoardPage />;
} 