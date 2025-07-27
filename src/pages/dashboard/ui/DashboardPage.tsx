export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📊 내 대시보드
          </h1>
          <p className="text-gray-600 mb-8">
            내가 만든 보드들을 관리하고 새로운 보드를 만들어보세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">새 보드 만들기</h3>
              <p className="text-gray-600">새로운 아이디어를 위한 보드를 생성하세요</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">내 첫 프로젝트</h3>
              <p className="text-blue-700 text-sm mb-4">2024.01.15 생성</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                보드 열기
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">팀 브레인스토밍</h3>
              <p className="text-green-700 text-sm mb-4">2024.01.10 생성</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                보드 열기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 