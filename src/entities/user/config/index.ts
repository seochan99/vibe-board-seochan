export const USER_CONFIG = {
  maxNameLength: 50,
  maxBioLength: 200,
  defaultAvatar: '/images/default-avatar.png',
  allowedAvatarTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxAvatarSize: 2 * 1024 * 1024, // 2MB
} as const; 