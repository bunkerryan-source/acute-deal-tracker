"use client";

import { useState, useEffect, useCallback } from "react";

const PASSWORD_KEY = "acute_password";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    if (storedPassword === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, password);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(PASSWORD_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}
