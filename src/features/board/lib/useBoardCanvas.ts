import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CursorPosition, BoardElement } from '../model';
import { boardApi } from '@/entities/board/api';
import { elementApi, CreateElementData } from '@/entities/element/api';
import { userApi } from '@/entities/user/api';
import { Board, BoardElement as SharedBoardElement } from '@/shared/types';
import { useAuthStore } from '@/shared/lib/stores/authStore';
import { supabase } from '@/shared/lib/supabase/client';

// Generate UUID for anonymous users
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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

export function useBoardCanvas() {
  const params = useParams();
  const boardId = params?.boardId as string;
  const { user, isAnonymous, sessionId } = useAuthStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time cursors
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [myCursor, setMyCursor] = useState<CursorPosition | null>(null);

  const [selectedTool, setSelectedTool] = useState<'postit' | 'image' | 'text' | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FEF3C7');
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<BoardElement | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [lastBroadcastTime, setLastBroadcastTime] = useState(0);
  const [isElementDragging, setIsElementDragging] = useState(false);

  // Generate unique session ID for anonymous users
  const currentSessionId = useRef(sessionId || (user?.id || generateUUID()));

  // Set anonymous session if needed
  useEffect(() => {
    if (!user && !isAnonymous && !sessionId) {
      const newSessionId = generateUUID();
      currentSessionId.current = newSessionId;
      // Store anonymous session in auth store
      const { setAnonymous } = useAuthStore.getState();
      setAnonymous(newSessionId);
    }
  }, [user, isAnonymous, sessionId]);

  // Convert shared BoardElement to local format
  const convertSharedToLocal = async (sharedElement: SharedBoardElement): Promise<BoardElement> => {
    // API에서 이미 userName을 포함해서 가져오므로 단순 변환만 수행
    return {
      id: sharedElement.id,
      type: sharedElement.type,
      x: sharedElement.position.x,
      y: sharedElement.position.y,
      width: sharedElement.size.width,
      height: sharedElement.size.height,
      content: sharedElement.content,
      color: sharedElement.color,
      userId: sharedElement.userId,
      userName: sharedElement.userName || 'Anonymous',
      image_url: sharedElement.image_url
    };
  };

  // Convert local BoardElement to shared format for updates
  const convertLocalToShared = (localElement: Partial<BoardElement>): Partial<SharedBoardElement> => ({
    content: localElement.content,
    position: localElement.x !== undefined && localElement.y !== undefined ? { x: localElement.x, y: localElement.y } : undefined,
    size: localElement.width !== undefined && localElement.height !== undefined ? { width: localElement.width, height: localElement.height } : undefined,
    color: localElement.color
  });

  // Load board and elements
  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Load board info
        const boardData = await boardApi.getBoard(boardId);
        setBoard(boardData);
        
        // Load board elements
        const elementsData = await elementApi.getBoardElements(boardId);
        const convertedElements = await Promise.all(elementsData.map(convertSharedToLocal));
        setElements(convertedElements);
      } catch (err) {
        console.error('Failed to load board data:', err);
        setError('보드 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBoardData();
  }, [boardId]);

  // 마우스 움직임 추적
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        // Calculate position relative to canvas offset and scale
        const x = (e.clientX - rect.left - canvasOffset.x) / scale;
        const y = (e.clientY - rect.top - canvasOffset.y) / scale;
        setMousePosition({ x, y });

        // Update my cursor position
        const cursorData: CursorPosition = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          userId: currentSessionId.current,
          userName: user?.name || user?.email?.split('@')[0] || (isAnonymous ? '나 (익명)' : 'Anonymous'),
          color: getUserColor(currentSessionId.current),
          lastSeen: Date.now()
        };
        setMyCursor(cursorData);

        // Broadcast cursor position via Supabase Realtime
        if (boardId) {
          // console.log('Broadcasting cursor move:', cursorData);
          const channel = supabase.channel(`board:${boardId}`);
          channel.send({
            type: 'broadcast',
            event: 'cursor_move',
            payload: cursorData
          });
        }
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [boardId, user, canvasOffset, scale, isAnonymous]);

  // Real-time subscription for cursors and elements
  useEffect(() => {
    if (!boardId) return;

    const channel = supabase.channel(`board:${boardId}`);

    // Subscribe to cursor movements
    channel
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        const cursorData = payload.payload as CursorPosition;
        console.log('Received cursor move:', cursorData);
        
        // Don't add my own cursor to the list
        if (cursorData.userId !== currentSessionId.current) {
          console.log('Adding/updating cursor for user:', cursorData.userName);
          setCursors(prev => {
            const existingIndex = prev.findIndex(c => c.userId === cursorData.userId);
            const cursorWithTimestamp = { ...cursorData, lastSeen: Date.now() };
            
            if (existingIndex >= 0) {
              // Update existing cursor
              const updated = [...prev];
              updated[existingIndex] = cursorWithTimestamp;
              return updated;
            } else {
              // Add new cursor
              return [...prev, cursorWithTimestamp];
            }
          });
        } else {
          console.log('Ignoring own cursor');
        }
      })
      .on('broadcast', { event: 'element_update' }, (payload) => {
        const { elementId, updates, userId } = payload.payload;
        console.log('Received element update:', { elementId, updates, userId });
        
        // Don't update if it's our own update
        if (userId === currentSessionId.current) return;
        
        setElements(prev => prev.map(el => {
          if (el.id === elementId) {
            // Convert shared updates to local format
            const localUpdates: Partial<BoardElement> = {};
            
            if (updates.position) {
              localUpdates.x = updates.position.x;
              localUpdates.y = updates.position.y;
            }
            if (updates.size) {
              localUpdates.width = updates.size.width;
              localUpdates.height = updates.size.height;
            }
            if (updates.content !== undefined) {
              localUpdates.content = updates.content;
            }
            if (updates.color !== undefined) {
              localUpdates.color = updates.color;
            }
            if (updates.image_url !== undefined) {
              localUpdates.image_url = updates.image_url;
            }
            
            return { ...el, ...localUpdates };
          }
          return el;
        }));
      })
      .on('broadcast', { event: 'element_create' }, (payload) => {
        const { element } = payload.payload;
        console.log('Received element create:', element);
        
        // Don't add if it's our own creation
        if (element.user_id === currentSessionId.current) return;
        
        convertSharedToLocal(element).then(newElement => {
          console.log('Adding new element from broadcast:', newElement);
          setElements(prev => [...prev, newElement]);
        });
      })
      .on('broadcast', { event: 'element_delete' }, (payload) => {
        const { elementId, userId } = payload.payload;
        console.log('Received element delete:', { elementId, userId });
        
        // Don't delete if it's our own deletion
        if (userId === currentSessionId.current) return;
        
        setElements(prev => prev.filter(el => el.id !== elementId));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [boardId, currentSessionId.current]);

  // Clean up cursors that haven't moved in 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors(prev => prev.filter(cursor => {
        // Remove cursors that haven't moved in 5 seconds
        return now - (cursor.lastSeen || 0) < 5000;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddElement = async (type: 'postit' | 'image' | 'text', imageUrl?: string) => {
    if (!boardId) return;
    
    try {
      // Use current user ID or session ID for anonymous users
      const userId = user?.id || currentSessionId.current;
      
      const elementData: CreateElementData = {
        board_id: boardId,
        user_id: userId,
        type,
        content: type === 'postit' ? '새 포스트잇' : type === 'text' ? '새 텍스트' : '이미지',
        position: { 
          x: mousePosition.x, 
          y: mousePosition.y 
        },
        size: { 
          width: type === 'postit' ? 200 : 150, 
          height: type === 'postit' ? 150 : 100 
        },
        color: type === 'postit' ? selectedColor : undefined,
        image_url: imageUrl
      };

      const newSharedElement = await elementApi.createElement(elementData);
      const newElement = await convertSharedToLocal(newSharedElement);
      setElements(prev => [...prev, newElement]);
      setSelectedTool(null);

      // Broadcast element creation
      if (boardId) {
        const channel = supabase.channel(`board:${boardId}`);
        channel.send({
          type: 'broadcast',
          event: 'element_create',
          payload: {
            element: newSharedElement,
            userId: currentSessionId.current
          }
        });
      }
    } catch (err) {
      console.error('Failed to create element:', err);
      // For anonymous users, just log the error but don't show it to user
      if (user) {
        setError('요소 생성에 실패했습니다.');
      }
    }
  };

  const handleElementMouseDown = (element: BoardElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsElementDragging(true);
    setDragElement(element);
    
    // Calculate drag offset relative to element
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const elementX = (e.clientX - rect.left - canvasOffset.x) / scale;
      const elementY = (e.clientY - rect.top - canvasOffset.y) / scale;
      
      // Store the offset between mouse and element center
      setDragOffset({
        x: elementX - element.x,
        y: elementY - element.y
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isElementDragging && dragElement && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - canvasOffset.x) / scale;
      const mouseY = (e.clientY - rect.top - canvasOffset.y) / scale;
      
      // Calculate new element position using drag offset
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      // Update local element position immediately for smooth dragging
      setElements(prev => prev.map(el => 
        el.id === dragElement.id ? { ...el, x: newX, y: newY } : el
      ));

      // Update dragElement with new position
      setDragElement(prev => prev ? { ...prev, x: newX, y: newY } : null);

      // Broadcast real-time position update during drag (throttled)
      const now = Date.now();
      if (now - lastBroadcastTime > 50) { // Throttle to 50ms
        if (boardId) {
          const channel = supabase.channel(`board:${boardId}`);
          channel.send({
            type: 'broadcast',
            event: 'element_update',
            payload: {
              elementId: dragElement.id,
              updates: { position: { x: newX, y: newY } },
              userId: currentSessionId.current
            }
          });
        }
        setLastBroadcastTime(now);
      }
    }
  };

  const handleCanvasMouseUp = async () => {
    if (isElementDragging && dragElement) {
      // Save element position to database
      try {
        await elementApi.updateElement(dragElement.id, {
          position: { x: dragElement.x, y: dragElement.y }
        });
      } catch (err) {
        console.error('Failed to update element position:', err);
        // For anonymous users, just log the error but don't show it to user
        if (user) {
          setError('요소 위치 업데이트에 실패했습니다.');
        }
      }
    }
    
    setIsElementDragging(false);
    setDragElement(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleElementUpdate = async (elementId: string, updates: Partial<BoardElement>) => {
    try {
      const sharedUpdates = convertLocalToShared(updates);
      const updatedSharedElement = await elementApi.updateElement(elementId, sharedUpdates);
      const updatedElement = await convertSharedToLocal(updatedSharedElement);
      setElements(prev => prev.map(el => 
        el.id === elementId ? updatedElement : el
      ));

      // Broadcast element update
      if (boardId) {
        const channel = supabase.channel(`board:${boardId}`);
        channel.send({
          type: 'broadcast',
          event: 'element_update',
          payload: {
            elementId,
            updates: sharedUpdates,
            userId: currentSessionId.current
          }
        });
      }
    } catch (err) {
      console.error('Failed to update element:', err);
      // For anonymous users, just log the error but don't show it to user
      if (user) {
        setError('요소 업데이트에 실패했습니다.');
      }
    }
  };

  const handleElementDelete = async (elementId: string) => {
    try {
      await elementApi.deleteElement(elementId);
      setElements(prev => prev.filter(el => el.id !== elementId));

      // Broadcast element deletion
      if (boardId) {
        const channel = supabase.channel(`board:${boardId}`);
        channel.send({
          type: 'broadcast',
          event: 'element_delete',
          payload: {
            elementId,
            userId: currentSessionId.current
          }
        });
      }
    } catch (err) {
      console.error('Failed to delete element:', err);
      // For anonymous users, just log the error but don't show it to user
      if (user) {
        setError('요소 삭제에 실패했습니다.');
      }
    }
  };

  return {
    canvasRef,
    board,
    setBoard,
    cursors,
    elements,
    isLoading,
    error,
    selectedTool,
    setSelectedTool,
    selectedColor,
    setSelectedColor,
    handleAddElement,
    handleElementMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementUpdate,
    handleElementDelete,
    canvasOffset,
    setCanvasOffset,
    scale,
    setScale,
  };
} 