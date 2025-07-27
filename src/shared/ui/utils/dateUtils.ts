export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "방금 전";
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR');
} 