import { StatsCard } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/ui/utils";
import { Board } from "@/shared/types";

interface StatsSectionProps {
  boards: Board[];
}

export function StatsSection({ boards }: StatsSectionProps) {
  const totalElements = boards.reduce((sum, board) => sum + board.element_count, 0);
  const publicBoards = boards.filter(board => board.is_public);
  const latestActivity = boards.length > 0 ? formatRelativeTime(boards[0].last_activity_at) : '없음';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="총 보드"
        value={boards.length}
      />
      
      <StatsCard
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        title="총 요소"
        value={totalElements}
      />
      
      <StatsCard
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        }
        title="공개 보드"
        value={publicBoards.length}
      />
      
      <StatsCard
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
        title="최근 활동"
        value={latestActivity}
      />
    </div>
  );
} 