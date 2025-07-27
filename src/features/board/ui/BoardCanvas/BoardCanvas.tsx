import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui";
import { BoardElement, CursorPosition } from "../../model";
import { useAuthStore } from "@/shared/lib/stores/authStore";
import { elementApi } from "@/entities/element/api";

interface BoardCanvasProps {
  boardId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  cursors: CursorPosition[];
  elements: BoardElement[];
  selectedTool: 'postit' | 'image' | 'text' | null;
  onElementMouseDown: (element: BoardElement, e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onCanvasClick: () => void;
  onToolSelect: (tool: 'postit' | 'image' | 'text' | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<BoardElement>) => Promise<void>;
  onElementDelete: (elementId: string) => Promise<void>;
  onAddElement: (type: 'postit' | 'image' | 'text', imageUrl?: string) => Promise<void>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: (offset: { x: number; y: number }) => void;
  scale: number;
  setScale: (scale: number) => void;
}

export function BoardCanvas({
  boardId,
  canvasRef,
  cursors,
  elements,
  selectedTool,
  onElementMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasClick,
  onToolSelect,
  onElementUpdate,
  onElementDelete,
  onAddElement,
  canvasOffset,
  setCanvasOffset,
  scale,
  setScale,
}: BoardCanvasProps) {
  const { user, isAnonymous, sessionId } = useAuthStore();
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleElementContentChange = async (elementId: string, content: string) => {
    try {
      await onElementUpdate(elementId, { content });
    } catch (err) {
      console.error('Failed to update element content:', err);
    }
  };

  const handleElementDelete = async (elementId: string) => {
    try {
      await onElementDelete(elementId);
    } catch (err) {
      console.error('Failed to delete element:', err);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Upload image to Supabase Storage
      const imageUrl = await elementApi.uploadImage(file, boardId);
      
      // Add image element to board using the add element handler with image URL
      await onAddElement('image', imageUrl);
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

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = '';

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const { type, url, name } = JSON.parse(data);
        if (type === 'image') {
          // Add image to canvas at drop position
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left - canvasOffset.x) / scale;
          const y = (e.clientY - rect.top - canvasOffset.y) / scale;
          
          // Create image element data
          const elementData = {
            board_id: boardId,
            user_id: user?.id || sessionId || crypto.randomUUID(),
            type: 'image' as const,
            content: name,
            position: { x, y },
            size: { width: 200, height: 200 },
            image_url: url
          };

          // Add element to board
          await onAddElement('image', url);
        }
      }
    } catch (err) {
      console.error('Failed to handle drop:', err);
    }
  };

  // Canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !selectedTool) { // Left click and no tool selected
      setIsCanvasDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only trigger if not dragging and tool is selected
    if (!isCanvasDragging && selectedTool) {
      onCanvasClick();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCanvasDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      // Call the parent's mouse move handler for cursor tracking and element dragging
      onCanvasMouseMove(e);
    }
  };

  const handleMouseUp = () => {
    setIsCanvasDragging(false);
    onCanvasMouseUp();
  };

  // Add wheel event listener with passive: false
  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    const handleWheelEvent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(3, scale * delta));
        setScale(newScale);
      }
    };

    canvasContainer.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvasContainer.removeEventListener('wheel', handleWheelEvent);
    };
  }, [scale]);

  const renderElement = (element: BoardElement) => {
    const baseClasses = "absolute cursor-move select-none";
    
    if (element.type === 'postit') {
      return (
        <div
          key={element.id}
          className={`${baseClasses} p-4 rounded-lg shadow-md group`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            backgroundColor: element.color,
            transform: `scale(${scale})`,
          }}
          onMouseDown={(e) => onElementMouseDown(element, e)}
        >
          <textarea
            value={element.content}
            onChange={(e) => onElementUpdate(element.id, { content: e.target.value })}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-[#333]"
            placeholder="포스트잇 내용을 입력하세요"
          />
          <div className="absolute top-1 right-1 text-xs text-gray-500">
            {element.userName}
          </div>
          {/* Delete button - only show for element creator */}
          {(element.userId === user?.id || element.userId === sessionId) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onElementDelete(element.id);
              }}
              className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
              title="삭제"
            >
              ×
            </button>
          )}
        </div>
      );
    }
    
    if (element.type === 'text') {
      return (
        <div
          key={element.id}
          className={`${baseClasses} p-2 group`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `scale(${scale})`,
          }}
          onMouseDown={(e) => onElementMouseDown(element, e)}
        >
          <textarea
            value={element.content}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-[#333]"
            placeholder="텍스트를 입력하세요"
            onChange={(e) => onElementUpdate(element.id, { content: e.target.value })}
          />
          <div className="absolute top-1 right-1 text-xs text-gray-500">
            {element.userName}
          </div>
          {/* Delete button - only show for element creator */}
          {(element.userId === user?.id || element.userId === sessionId) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onElementDelete(element.id);
              }}
              className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
              title="삭제"
            >
              ×
            </button>
          )}
        </div>
      );
    }

    if (element.type === 'image') {
      return (
        <div
          key={element.id}
          className={`${baseClasses} group`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `scale(${scale})`,
          }}
          onMouseDown={(e) => onElementMouseDown(element, e)}
        >
          <img
            src={element.image_url}
            alt={element.content}
            className="w-full h-full object-cover rounded"
            draggable={false}
          />
          <div className="absolute top-1 right-1 text-xs text-gray-500 bg-white bg-opacity-75 px-1 rounded">
            {element.userName}
          </div>
          {/* Delete button - only show for element creator */}
          {(element.userId === user?.id || element.userId === sessionId) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onElementDelete(element.id);
              }}
              className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
              title="삭제"
            >
              ×
            </button>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Grid pattern for infinite canvas
  const renderGrid = () => {
    const gridSize = 20 * scale;
    const pattern = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${gridSize}" height="${gridSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `)}`;

    return (
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${pattern}")`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
        }}
      />
    );
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50">
      <div
        ref={canvasContainerRef}
        className="w-full h-full relative cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Infinite Canvas Background */}
        <div 
          className="absolute inset-0"
          style={{
            width: '10000px',
            height: '10000px',
            left: '-5000px',
            top: '-5000px',
          }}
        >
          {renderGrid()}
        </div>

        {/* Canvas Content */}
        <div
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Real-time cursors */}
          {cursors.map((cursor) => (
            <div
              key={cursor.userId}
              className="absolute pointer-events-none z-10"
              style={{
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Cursor dot */}
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: cursor.color }}
              />
              {/* User name */}
              <div
                className="absolute top-4 left-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.userName}
              </div>
            </div>
          ))}
          
          {/* 보드 요소들 */}
          {elements.map(renderElement)}
        </div>

        {/* 선택된 도구 안내 */}
        {selectedTool && (
          <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-10">
            캔버스를 클릭하여 {selectedTool === 'postit' ? '포스트잇' : selectedTool === 'text' ? '텍스트' : '이미지'}을 추가하세요
          </div>
        )}

        {/* 이미지 업로드 버튼 */}
        {selectedTool === 'image' && (
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>업로드 중...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>이미지 업로드</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}
        
        {/* 빈 캔버스 안내 */}
        {elements.length === 0 && !selectedTool && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">빈 캔버스</h3>
              <p className="text-gray-500 mb-4">왼쪽 도구를 선택하여 요소를 추가해보세요</p>
              <Button onClick={() => onToolSelect('postit')}>
                포스트잇 추가하기
              </Button>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
          <button
            onClick={() => setScale(Math.min(3, scale * 1.2))}
            className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center"
            title="확대"
          >
            <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          <button
            onClick={() => setScale(Math.max(0.1, scale * 0.8))}
            className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center"
            title="축소"
          >
            <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setScale(1);
              setCanvasOffset({ x: 0, y: 0 });
            }}
            className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-xs font-medium"
            title="초기화"
          >
            <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 