"use client";

import { useAuth } from "@/hooks/useAuth";
import PasswordScreen from "./PasswordScreen";
import AppShell from "./AppShell";

export default function AuthGate() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone">
        <div className="text-sm text-ink-40">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordScreen onLogin={login} />;
  }

  return <AppShell />;
}
