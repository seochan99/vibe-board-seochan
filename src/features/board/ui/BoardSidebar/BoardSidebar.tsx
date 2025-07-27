import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui";
import { CursorPosition } from "@/features/board/model";
import { useAuthStore } from "@/shared/lib/stores/authStore";
import { elementApi } from "@/entities/element/api";

interface BoardSidebarProps {
  selectedTool: 'postit' | 'image' | 'text' | null;
  onToolSelect: (tool: 'postit' | 'image' | 'text' | null) => void;
  cursors: CursorPosition[];
  boardId: string;
  onAddImageToCanvas: (imageUrl: string, fileName: string) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

// Generate consistent color for user
function getUserColor(userId: string): string {
  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#84CC16', // Lime
    '#6366F1', // Indigo
  ];
  
  // Use userId to consistently assign the same color to the same user
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

export function BoardSidebar({ selectedTool, onToolSelect, cursors, boardId, onAddImageToCanvas, selectedColor, onColorSelect }: BoardSidebarProps) {
  const { user, isAnonymous, sessionId } = useAuthStore();
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem(`board-images-${boardId}`);
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        setUploadedImages(parsedImages);
      } catch (err) {
        console.error('Failed to parse saved images:', err);
      }
    }
  }, [boardId]);

  // Save images to localStorage whenever uploadedImages changes
  useEffect(() => {
    if (uploadedImages.length > 0) {
      localStorage.setItem(`board-images-${boardId}`, JSON.stringify(uploadedImages));
    }
  }, [uploadedImages, boardId]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const imageUrl = await elementApi.uploadImage(file, boardId);
      console.log('Uploaded image URL:', imageUrl);
      const newImage = { url: imageUrl, name: file.name };
      setUploadedImages(prev => [...prev, newImage]);
      console.log('Updated uploaded images:', [...uploadedImages, newImage]);
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop for images
  const handleImageDragStart = (e: React.DragEvent, imageUrl: string, fileName: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'image', url: imageUrl, name: fileName }));
  };

  // Handle image deletion
  const handleImageDelete = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Include current user in participants list
  const currentUserInList = cursors.find(c => c.userId === (user?.id || sessionId));
  const allParticipants = [
    ...cursors,
    ...(currentUserInList ? [] : [{
      userId: user?.id || sessionId || 'unknown',
      userName: user?.name || user?.email?.split('@')[0] || (isAnonymous ? '나 (익명)' : 'Anonymous'),
      color: user ? getUserColor(user.id) : '#EF4444', // Use consistent color for anonymous users
      x: 0,
      y: 0,
      lastSeen: Date.now()
    }])
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">도구</h2>
        
        {/* 도구 버튼들 */}
        <div className="space-y-3 mb-6">
          <div>
            <Button
              variant={selectedTool === 'postit' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onToolSelect(selectedTool === 'postit' ? null : 'postit')}
              className="w-full justify-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              포스트잇
            </Button>
            <p className="text-xs text-gray-500 mt-1 ml-4">노트와 아이디어를 기록하세요</p>
          </div>
          
          <div>
            <Button
              variant={selectedTool === 'text' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onToolSelect(selectedTool === 'text' ? null : 'text')}
              className="w-full justify-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              텍스트
            </Button>
            <p className="text-xs text-gray-500 mt-1 ml-4">자유롭게 텍스트를 입력하세요</p>
          </div>

        </div>

        {/* 선택된 도구 안내 */}
        {selectedTool && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">도구 선택됨</span>
            </div>
            <p className="text-xs text-blue-700">
              캔버스를 클릭하여 {selectedTool === 'postit' ? '포스트잇' : selectedTool === 'text' ? '텍스트' : '이미지'}을 추가하세요
            </p>
          </div>
        )}
        
        {/* 이미지 업로드 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">이미지 업로드</h3>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  업로드 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  이미지 업로드
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 이미지 저장소 */}
        {uploadedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">이미지 저장소</h3>
            <div className="grid grid-cols-2 gap-2">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-move border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors bg-gray-50"
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, image.url, image.name)}
                  onClick={() => onAddImageToCanvas(image.url, image.name)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      console.error('Failed to load image:', image.url);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', image.url);
                    }}
                  />
                  {/* Fallback for failed images */}
                  <div className="hidden w-full h-20 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">이미지 로드 실패</p>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(index);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                    title="삭제"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 색상 팔레트 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">색상</h3>
          <div className="grid grid-cols-4 gap-2">
            {['#FEF3C7', '#DBEAFE', '#FCE7F3', '#D1FAE5', '#FED7AA', '#E0E7FF'].map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition-colors ${
                  selectedColor === color 
                    ? 'border-black scale-110' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>
        </div>
        
        {/* 참여자 목록 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">참여자 ({allParticipants.length}명)</h3>
          <div className="space-y-2">
            {allParticipants.map((cursor) => (
              <div key={cursor.userId} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cursor.color }}
                />
                <span className="text-sm text-gray-600">{cursor.userName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 