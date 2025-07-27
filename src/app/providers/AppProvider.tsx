'use client';

import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <div className="app-provider">
      {children}
    </div>
  );
} 