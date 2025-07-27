"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/lib/components";

export function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    // LoginForm에서 처리됨
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <AuthRedirect redirectTo="/dashboard">
      <LoginForm onGoHome={handleGoHome} />
    </AuthRedirect>
  );
} 