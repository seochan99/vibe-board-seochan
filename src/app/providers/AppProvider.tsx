'use client';

  import { ThemeProvider } from "./ThemeProvider";
  import { AuthProvider } from "@/shared/lib/providers";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
} 