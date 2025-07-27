export function FeaturesSection() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            실시간 협업의 새로운 경험
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            팀과 함께 아이디어를 발전시키고 실시간으로 소통하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">실시간 협업</h3>
            <p className="text-gray-600">여러 사용자가 동시에 보드를 편집하고 실시간으로 변경사항을 확인할 수 있습니다.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">다양한 콘텐츠</h3>
            <p className="text-gray-600">포스트잇, 이미지 등 다양한 형태의 콘텐츠를 자유롭게 추가하고 편집할 수 있습니다.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">빠른 시작</h3>
            <p className="text-gray-600">Google 계정으로 간편하게 로그인하고 즉시 협업을 시작할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 