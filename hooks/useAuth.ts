"use client";

import { useState, useEffect, useCallback } from "react";
import { UserName } from "@/lib/database.types";

const PASSWORD_KEY = "acute_password";
const USER_KEY = "acute_user";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    if (storedPassword === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      setIsAuthenticated(true);
    }
    const storedUser = localStorage.getItem(USER_KEY) as UserName | null;
    if (storedUser === "Ryan" || storedUser === "Matt") {
      setCurrentUser(storedUser);
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

  const setUser = useCallback((name: UserName) => {
    localStorage.setItem(USER_KEY, name);
    setCurrentUser(name);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(PASSWORD_KEY);
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  return { isAuthenticated, currentUser, isLoading, login, setUser, logout };
}
