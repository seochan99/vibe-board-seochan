"use client";
import { useState } from "react";
import { useAuthStore } from "@/shared/lib/stores";

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const { resetPassword, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">이메일 전송 완료</h2>
          <p className="text-gray-600 mb-6">
            비밀번호 재설정 링크가 <strong>{email}</strong>로 전송되었습니다.<br/>
            이메일을 확인하여 비밀번호를 재설정해주세요.
          </p>
          <button onClick={onSwitchToLogin} className="text-black font-medium hover:underline">
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 재설정</h2>
        <p className="text-gray-600">가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
      </div>
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
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>전송 중...</span>
            </div>
          ) : ('재설정 링크 보내기')}
        </button>
      </form>
      <div className="text-center">
        <button onClick={onSwitchToLogin} className="text-black font-medium hover:underline">
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
} 