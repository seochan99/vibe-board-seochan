export const CONTENT_CREATION_CONFIG = {
  maxImageSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxPostItLength: 1000,
  minElementSize: { width: 50, height: 50 },
  maxElementSize: { width: 800, height: 600 },
} as const; 