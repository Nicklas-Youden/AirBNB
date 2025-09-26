import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContextType";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setTokenState(savedToken);
    }
  }, []);

  // Function to set token and save to localStorage
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const isLoggedIn = !!token;

  const value: AuthContextType = {
    token,
    isAuthenticated: isLoggedIn,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
