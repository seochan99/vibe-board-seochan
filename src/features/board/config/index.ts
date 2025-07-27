export const BOARD_MANAGEMENT_CONFIG = {
  maxBoardsPerUser: 50,
  maxBoardNameLength: 100,
  defaultBoardName: '새 보드',
  boardNamePattern: /^[a-zA-Z0-9가-힣\s\-_]{1,100}$/,
} as const; 