export interface BoardElement {
  id: string;
  boardId: string;
  userId: string;
  userName?: string;
  type: 'postit' | 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
} 