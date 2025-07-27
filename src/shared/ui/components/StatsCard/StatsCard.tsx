import React from 'react';

export interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ icon, title, value, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 text-gray-600">
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
} 