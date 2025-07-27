export const REAL_TIME_CONFIG = {
  maxConnectedUsers: 20,
  heartbeatInterval: 30000, // 30초
  reconnectAttempts: 5,
  reconnectDelay: 1000, // 1초
  eventThrottle: 100, // 100ms
} as const; 