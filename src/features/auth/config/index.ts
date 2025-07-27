export const AUTH_CONFIG = {
  providers: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  redirectUrl: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || '/dashboard',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24시간
} as const; 