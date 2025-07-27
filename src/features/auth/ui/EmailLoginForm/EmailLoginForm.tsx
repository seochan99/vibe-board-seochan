"use client";
import { useState } from "react";
import { useAuthStore } from "@/shared/lib/stores";

interface EmailLoginFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToGoogle: () => void;
  onForgotPassword: () => void;
}

export function EmailLoginForm({
  onSwitchToSignUp,
  onSwitchToGoogle,
  onForgotPassword
}: EmailLoginFormProps) {
  const { signInWithEmail, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // 이전 에러 초기화
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      // 에러는 useAuthStore에서 처리되므로 여기서는 추가 처리만
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">로그인 실패</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333]"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333]"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>로그인 중...</span>
            </div>
          ) : ('이메일로 로그인')}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>
      <button
        onClick={onSwitchToGoogle}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Google로 계속하기</span>
      </button>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <button onClick={onSwitchToSignUp} className="text-black font-medium hover:underline">회원가입</button>
        </p>
      </div>
    </div>
  );
} 