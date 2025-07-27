"use client";
import { useRouter } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/lib/components";

export function ResetPasswordPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToLogin = () => {
    router.push('/auth');
  };

  return (
    <AuthRedirect redirectTo="/dashboard">
      <ResetPasswordForm onSwitchToLogin={handleGoToLogin} />
    </AuthRedirect>
  );
} 