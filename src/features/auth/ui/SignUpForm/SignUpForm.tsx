"use client";
import { useState } from "react";
import { useAuthStore } from "@/shared/lib/stores";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSwitchToGoogle: () => void;
}

export function SignUpForm({ onSwitchToLogin, onSwitchToGoogle }: SignUpFormProps) {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "비밀번호는 최소 6자 이상이어야 합니다.";
    if (!hasUpperCase) return "대문자를 포함해야 합니다.";
    if (!hasLowerCase) return "소문자를 포함해야 합니다.";
    if (!hasNumber) return "숫자를 포함해야 합니다.";
    if (!hasSpecialChar) return "특수문자를 포함해야 합니다.";
    
    return "";
  };

  // 비밀번호 변경 시 검증
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
  };

  // 비밀번호 확인 변경 시 검증
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError(); // 이전 에러 초기화
    
    if (!name.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error('Sign up failed:', error);
      // 에러는 useAuthStore에서 처리되므로 여기서는 추가 처리만
    }
  };

  const isFormValid = name.trim() && 
                     password && 
                     confirmPassword && 
                     password === confirmPassword && 
                     !passwordError && 
                     !confirmPasswordError;

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
              <h3 className="text-sm font-medium text-red-800">회원가입 실패</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333]" 
            placeholder="닉네임을 입력하세요" 
            required 
          />
        </div>
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
            onChange={(e) => handlePasswordChange(e.target.value)} 
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333] ${
              passwordError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="••••••••" 
            required 
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>비밀번호 조건:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-400'}>최소 6자 이상</li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>대문자 포함</li>
              <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>소문자 포함</li>
              <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}>숫자 포함</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}>특수문자 포함</li>
            </ul>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => handleConfirmPasswordChange(e.target.value)} 
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333] ${
              confirmPasswordError ? 'border-red-300' : confirmPassword && password === confirmPassword ? 'border-green-300' : 'border-gray-300'
            }`}
            placeholder="••••••••" 
            required 
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
          )}
          {confirmPassword && password === confirmPassword && !confirmPasswordError && (
            <p className="text-green-600 text-sm mt-1">비밀번호가 일치합니다.</p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !isFormValid} 
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>회원가입 중...</span>
            </div>
          ) : ('회원가입')}
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
          이미 계정이 있으신가요?{" "}
          <button onClick={onSwitchToLogin} className="text-black font-medium hover:underline">로그인</button>
        </p>
      </div>
    </div>
  );
} 