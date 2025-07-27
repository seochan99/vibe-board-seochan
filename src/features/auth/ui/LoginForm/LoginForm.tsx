"use client";
import { useState } from "react";
import { useAuthStore } from "@/shared/lib/stores";
import { EmailLoginForm } from "../EmailLoginForm";
import { SignUpForm } from "../SignUpForm";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { useRouter } from "next/navigation";

type AuthMode = 'login' | 'signup' | 'reset-password';

interface LoginFormProps {
  onGoHome: () => void;
}

export function LoginForm({ onGoHome }: LoginFormProps) {
  const router = useRouter();   
  const { signIn, isLoading, error } = useAuthStore();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleGoogleLogin = async () => {
    await signIn();
  };

  const handleSwitchToSignUp = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleSwitchToResetPassword = () => {
    setAuthMode('reset-password');
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login':
        return '로그인';
      case 'signup':
        return '회원가입';
      case 'reset-password':
        return '비밀번호 재설정';
      default:
        return '로그인';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'login':
        return '계정에 로그인하여 협업을 시작하세요';
      case 'signup':
        return '새로운 계정을 만들어 협업을 시작하세요';
      case 'reset-password':
        return '비밀번호를 재설정하세요';
      default:
        return '계정에 로그인하여 협업을 시작하세요';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div onClick={() => router.push('/')} className="cursor-pointer flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">V</span>
            </div>
              <span className="text-2xl font-bold text-gray-900">Vibe Board</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            {getSubtitle()}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {authMode === 'login' && (
            <EmailLoginForm
              onSwitchToSignUp={handleSwitchToSignUp}
              onSwitchToGoogle={handleGoogleLogin}
              onForgotPassword={handleSwitchToResetPassword}
            />
          )}

          {authMode === 'signup' && (
            <SignUpForm
              onSwitchToLogin={handleSwitchToLogin}
              onSwitchToGoogle={handleGoogleLogin}
            />
          )}

          {authMode === 'reset-password' && (
            <ResetPasswordForm
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            <button 
              onClick={onGoHome}
              className="text-black font-medium hover:underline"
            >
              홈으로 돌아가기
            </button>
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">실시간 협업</h3>
              <p className="text-sm text-gray-600">팀과 함께 실시간으로 작업하세요</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">빠른 시작</h3>
              <p className="text-sm text-gray-600">이메일 또는 Google로 즉시 시작</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 