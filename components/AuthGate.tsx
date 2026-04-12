"use client";

import { useAuth } from "@/hooks/useAuth";
import PasswordScreen from "./PasswordScreen";
import AppShell from "./AppShell";

export default function AuthGate() {
  const { isAuthenticated, currentUser, isLoading, login, setUser } =
    useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordScreen onLogin={login} />;
  }

  return <AppShell currentUser={currentUser} onSelectUser={setUser} />;
}
