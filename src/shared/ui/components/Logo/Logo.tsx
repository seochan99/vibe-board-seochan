import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-black rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold">V</span>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Vibe Board
        </span>
      )}
    </div>
  );
} 