"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by looking for a token in localStorage
    const checkAuth = () => {
      localStorage.removeItem("auth_token");
      const token = localStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const redirectToLogin = () => {
    router.push("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    redirectToLogin
  };
} 