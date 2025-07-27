// 공유 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Board {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface BoardElement {
  id: string;
  board_id: string;
  user_id: string;
  type: 'note' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
} 