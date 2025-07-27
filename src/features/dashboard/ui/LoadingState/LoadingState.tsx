export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">보드를 불러오는 중...</p>
      </div>
    </div>
  );
} 