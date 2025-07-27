import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg';
  const hoverClasses = hover ? 'hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
} 