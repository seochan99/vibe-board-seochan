// 공유 상수 정의
export const APP_NAME = 'Vibe Board';

export const BOARD_ELEMENT_TYPES = {
  NOTE: 'note',
  IMAGE: 'image',
} as const;

export const POSTIT_COLORS = [
  '#FFFF88', // 노란색
  '#FFB3BA', // 분홍색
  '#BAFFC9', // 연두색
  '#BAE1FF', // 연파랑색
  '#FFB3D9', // 연보라색
  '#FFD4B3', // 연주황색
] as const;

export const DEFAULT_POSTIT_SIZE = {
  width: 200,
  height: 150,
};

export const DEFAULT_IMAGE_SIZE = {
  width: 300,
  height: 200,
};

export const BOARD_CANVAS_SIZE = {
  width: 2000,
  height: 2000,
}; 