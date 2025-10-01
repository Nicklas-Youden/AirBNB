import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/api/useApi";
import Connection from "../hooks/api/connection";

type User = {
  id: string;
  email: string;
  username: string;
  phone: number;
};

type LoginData = {
  email: string;
  password: string;
  remember_me?: boolean;
};

type TAuthContext = {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  loading: boolean;
};

const AuthContext = React.createContext<TAuthContext>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  setToken: () => {},
  loading: false,
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setTokenState] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const api = useApi();

  // Load stored auth data on mount
  useEffect(() => {
    const storedData = localStorage.getItem("authData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.token && parsedData.user) {
          setTokenState(parsedData.token);
          setUser(parsedData.user);
        }
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("authData");
      }
    }
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    setLoading(true);
    try {
      const response = (await api.login(data.email, data.password)) as unknown;
      const loginResponse = response as {
        token?: string;
        user?: {
          id?: string;
          email?: string;
          username?: string;
          name?: string;
          phone?: number;
        };
      };

      if (loginResponse.token) {
        const userData: User = {
          id: loginResponse.user?.id || "1",
          email: loginResponse.user?.email || data.email,
          username:
            loginResponse.user?.username ||
            loginResponse.user?.name ||
            data.email.split("@")[0],
          phone: loginResponse.user?.phone || 0,
        };

        setUser(userData);
        setTokenState(loginResponse.token);

        // Store in localStorage
        const authData = {
          user: userData,
          token: loginResponse.token,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(undefined);
    setTokenState(undefined);
    localStorage.removeItem("authData");
  };

  const setToken = (newToken: string | null) => {
    if (newToken) {
      setTokenState(newToken);
      // Update localStorage if user exists
      if (user) {
        const authData = { user, token: newToken };
        localStorage.setItem("authData", JSON.stringify(authData));
      }
    } else {
      logout();
    }
  };

  const value: TAuthContext = {
    user,
    token,
    isAuthenticated: !!(user && token),
    login,
    logout,
    setToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
