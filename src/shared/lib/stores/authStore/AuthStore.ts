import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/shared/lib/supabase/client';
import { User } from '@/shared/types';

// Generate UUID for anonymous users
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAnonymous: boolean;
  sessionId: string | null;
  error: string | null;
  checkAuth: () => Promise<void>;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAnonymous: (sessionId: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAnonymous: false,
      sessionId: null,
      error: null,
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // 로그인된 사용자: 프로필 정보 가져오기
            try {
              const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (userProfile) {
                set({ 
                  user: userProfile, 
                  isLoading: false, 
                  isAnonymous: false,
                  sessionId: session.user.id 
                });
              } else {
                // 사용자 프로필이 없으면 생성
                const { data: newUserProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: session.user.user_metadata?.avatar_url
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Failed to create user profile:', createError);
                  // 프로필 생성 실패해도 기본 정보로 설정
                  set({ 
                    user: { 
                      id: session.user.id, 
                      email: session.user.email || '', 
                      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
                      avatar_url: session.user.user_metadata?.avatar_url,
                      created_at: session.user.created_at,
                      updated_at: session.user.updated_at || session.user.created_at
                    }, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: session.user.id 
                  });
                } else {
                  set({ 
                    user: newUserProfile, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: session.user.id 
                  });
                }
              }
            } catch (error) {
              // 프로필 가져오기 실패 시 생성 시도
              try {
                const { data: newUserProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: session.user.user_metadata?.avatar_url
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Failed to create user profile:', createError);
                  // 프로필 생성 실패해도 기본 정보로 설정
                  set({ 
                    user: { 
                      id: session.user.id, 
                      email: session.user.email || '', 
                      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
                      avatar_url: session.user.user_metadata?.avatar_url,
                      created_at: session.user.created_at,
                      updated_at: session.user.updated_at || session.user.created_at
                    }, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: session.user.id 
                  });
                } else {
                  set({ 
                    user: newUserProfile, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: session.user.id 
                  });
                }
              } catch (createError) {
                console.error('Failed to create user profile:', createError);
                // 프로필 생성 실패해도 기본 정보로 설정
                set({ 
                  user: { 
                    id: session.user.id, 
                    email: session.user.email || '', 
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: session.user.user_metadata?.avatar_url,
                    created_at: session.user.created_at,
                    updated_at: session.user.updated_at || session.user.created_at
                  }, 
                  isLoading: false, 
                  isAnonymous: false,
                  sessionId: session.user.id 
                });
              }
            }
          } else {
            // 로그인되지 않은 사용자: 익명 세션 확인
            const { sessionId } = get();
            if (sessionId && sessionId.startsWith('anon_')) {
              set({ 
                user: null, 
                isLoading: false, 
                isAnonymous: true, 
                sessionId 
              });
            } else {
              // 완전히 로그아웃된 상태
              set({ 
                user: null, 
                isLoading: false, 
                isAnonymous: false, 
                sessionId: null 
              });
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // 에러 발생 시 로그아웃 상태로 설정
          set({ 
            user: null, 
            isLoading: false, 
            isAnonymous: false, 
            sessionId: null 
          });
        }
      },
      signIn: async () => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (error) {
            console.error('Google sign in error:', error);
            set({ isLoading: false });
            return;
          }

          // 로그인 성공 시 사용자 정보는 checkAuth에서 처리
          set({ isLoading: false });
        } catch (error) {
          console.error('Google sign in failed:', error);
          set({ isLoading: false });
        }
      },
      signInWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Email sign in error:', error);
            
            // 더 자세한 에러 메시지 제공
            let errorMessage = '로그인에 실패했습니다.';
            if (error.message.includes('Email not confirmed')) {
              errorMessage = '이메일이 확인되지 않았습니다. 이메일을 확인해주세요.';
            } else if (error.message.includes('Invalid login credentials')) {
              errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
            } else if (error.message.includes('Too many requests')) {
              errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('User not found')) {
              errorMessage = '등록되지 않은 이메일입니다. 회원가입을 먼저 해주세요.';
            } else if (error.message.includes('Invalid email')) {
              errorMessage = '올바른 이메일 형식을 입력해주세요.';
            } else if (error.message.includes('Password should be at least')) {
              errorMessage = '비밀번호가 너무 짧습니다.';
            } else if (error.message.includes('Unable to validate email')) {
              errorMessage = '이메일 인증에 실패했습니다. 이메일을 다시 확인해주세요.';
            } else if (error.message.includes('Email rate limit exceeded')) {
              errorMessage = '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            }
            
            set({ isLoading: false, error: errorMessage });
            return;
          }

          if (data.user) {
            // 사용자 프로필 생성 또는 가져오기
            try {
              const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (userProfile) {
                set({ 
                  user: userProfile, 
                  isLoading: false, 
                  isAnonymous: false,
                  sessionId: data.user.id 
                });
              } else {
                // 사용자 프로필이 없으면 생성
                const { data: newUserProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: data.user.user_metadata?.avatar_url
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Failed to create user profile:', createError);
                  // 프로필 생성 실패해도 기본 정보로 설정
                  set({ 
                    user: { 
                      id: data.user.id, 
                      email: data.user.email || '', 
                      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Anonymous',
                      avatar_url: data.user.user_metadata?.avatar_url,
                      created_at: data.user.created_at,
                      updated_at: data.user.updated_at || data.user.created_at
                    }, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: data.user.id 
                  });
                } else {
                  set({ 
                    user: newUserProfile, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: data.user.id 
                  });
                }
              }
            } catch (profileError) {
              console.error('Failed to get user profile:', profileError);
              // 프로필 가져오기 실패 시 생성 시도
              try {
                const { data: newUserProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: data.user.user_metadata?.avatar_url
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Failed to create user profile:', createError);
                  // 프로필 생성 실패해도 기본 정보로 설정
                  set({ 
                    user: { 
                      id: data.user.id, 
                      email: data.user.email || '', 
                      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Anonymous',
                      avatar_url: data.user.user_metadata?.avatar_url,
                      created_at: data.user.created_at,
                      updated_at: data.user.updated_at || data.user.created_at
                    }, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: data.user.id 
                  });
                } else {
                  set({ 
                    user: newUserProfile, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: data.user.id 
                  });
                }
              } catch (createError) {
                console.error('Failed to create user profile:', createError);
                // 프로필 생성 실패해도 기본 정보로 설정
                set({ 
                  user: { 
                    id: data.user.id, 
                    email: data.user.email || '', 
                    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: data.user.user_metadata?.avatar_url,
                    created_at: data.user.created_at,
                    updated_at: data.user.updated_at || data.user.created_at
                  }, 
                  isLoading: false, 
                  isAnonymous: false,
                  sessionId: data.user.id 
                });
              }
            }
          }
        } catch (error) {
          console.error('Email sign in failed:', error);
          set({ isLoading: false, error: error instanceof Error ? error.message : '로그인에 실패했습니다.' });
        }
      },
      signUp: async (email: string, password: string, name?: string) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            console.error('Sign up error:', error);
            
            // 더 자세한 회원가입 에러 메시지 제공
            let errorMessage = '회원가입에 실패했습니다.';
            if (error.message.includes('User already registered')) {
              errorMessage = '이미 등록된 이메일입니다. 로그인해주세요.';
            } else if (error.message.includes('Password should be at least')) {
              errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
            } else if (error.message.includes('Invalid email')) {
              errorMessage = '올바른 이메일 형식을 입력해주세요.';
            } else if (error.message.includes('Email rate limit exceeded')) {
              errorMessage = '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('Unable to validate email')) {
              errorMessage = '이메일 인증에 실패했습니다. 이메일을 다시 확인해주세요.';
            } else if (error.message.includes('Signup disabled')) {
              errorMessage = '현재 회원가입이 일시적으로 비활성화되었습니다.';
            }
            
            set({ isLoading: false, error: errorMessage });
            return;
          }

          if (data.user) {
            // 이메일 확인 없이 자동으로 로그인
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) {
              console.error('Auto sign in after signup failed:', signInError);
              set({ isLoading: false, error: '회원가입 후 자동 로그인에 실패했습니다.' });
              return;
            }

            if (signInData.user) {
              // 사용자 프로필 생성
              try {
                const { data: userProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: signInData.user.id,
                    email: signInData.user.email,
                    name: name || signInData.user.user_metadata?.full_name || signInData.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: signInData.user.user_metadata?.avatar_url
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Failed to create user profile:', createError);
                  // 프로필 생성 실패해도 기본 정보로 설정
                  set({ 
                    user: { 
                      id: signInData.user.id, 
                      email: signInData.user.email || '', 
                      name: name || signInData.user.user_metadata?.full_name || signInData.user.email?.split('@')[0] || 'Anonymous',
                      avatar_url: signInData.user.user_metadata?.avatar_url,
                      created_at: signInData.user.created_at,
                      updated_at: signInData.user.updated_at || signInData.user.created_at
                    }, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: signInData.user.id 
                  });
                } else {
                  set({ 
                    user: userProfile, 
                    isLoading: false, 
                    isAnonymous: false,
                    sessionId: signInData.user.id 
                  });
                }
              } catch (profileError) {
                console.error('Failed to create user profile:', profileError);
                // 프로필 생성 실패해도 기본 정보로 설정
                set({ 
                  user: { 
                    id: signInData.user.id, 
                    email: signInData.user.email || '', 
                    name: name || signInData.user.user_metadata?.full_name || signInData.user.email?.split('@')[0] || 'Anonymous',
                    avatar_url: signInData.user.user_metadata?.avatar_url,
                    created_at: signInData.user.created_at,
                    updated_at: signInData.user.updated_at || signInData.user.created_at
                  }, 
                  isLoading: false, 
                  isAnonymous: false,
                  sessionId: signInData.user.id 
                });
              }
            }
          }
        } catch (error) {
          console.error('Sign up failed:', error);
          set({ isLoading: false, error: error instanceof Error ? error.message : '회원가입에 실패했습니다.' });
        }
      },
      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          if (error) {
            console.error('Reset password error:', error);
            
            // 더 자세한 비밀번호 재설정 에러 메시지 제공
            let errorMessage = '비밀번호 재설정 이메일 전송에 실패했습니다.';
            if (error.message.includes('User not found')) {
              errorMessage = '등록되지 않은 이메일입니다. 회원가입을 먼저 해주세요.';
            } else if (error.message.includes('Invalid email')) {
              errorMessage = '올바른 이메일 형식을 입력해주세요.';
            } else if (error.message.includes('Email rate limit exceeded')) {
              errorMessage = '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('Unable to validate email')) {
              errorMessage = '이메일 인증에 실패했습니다. 이메일을 다시 확인해주세요.';
            }
            
            set({ isLoading: false, error: errorMessage });
            return;
          }

          // 성공 시 에러 메시지 초기화
          set({ isLoading: false, error: null });
        } catch (error) {
          console.error('Reset password failed:', error);
          set({ isLoading: false, error: error instanceof Error ? error.message : '비밀번호 재설정에 실패했습니다.' });
        }
      },
      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            isLoading: false, 
            isAnonymous: false, 
            sessionId: null 
          });
        } catch (error) {
          console.error('Sign out failed:', error);
        }
      },
      setAnonymous: (sessionId: string) => {
        set({ 
          user: null, 
          isLoading: false, 
          isAnonymous: true, 
          sessionId 
        });
      },
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAnonymous: state.isAnonymous, 
        sessionId: state.sessionId 
      }),
      onRehydrateStorage: () => (state) => {
        // 저장된 상태가 복원될 때 로딩 상태를 false로 설정
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
); 