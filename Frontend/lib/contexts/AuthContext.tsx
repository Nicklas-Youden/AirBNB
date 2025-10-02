import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/api/useApi";

type Tuser = {
  id: string;
  email: string;
  name: string;
  phone: string;
};

type Tsignup = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
};

type Tlogin = {
  email: string;
  password: string;
};

type TAuthContext = {
  user?: Tuser;
  token?: string;
  isAuthenticated: boolean;
  login: (data: Tlogin) => Promise<void>;
  signup: (data: Tsignup) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  loading: boolean;
};

const AuthContext = React.createContext<TAuthContext>({
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  setToken: () => {},
  loading: false,
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Tuser | undefined>(undefined);
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

  // SIGN UP AUTH CONTEXT
  const signup = async (data: Tsignup): Promise<void> => {
    setLoading(true);
    try {
      const response = (await api.signup(
        data.email,
        data.password,
        data.confirmPassword,
        data.name,
        data.phone
      )) as unknown;

      const signupResponse = response as {
        token?: string;
        user?: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
        };
      };

      if (signupResponse.token) {
        const userData: Tuser = {
          id: signupResponse.user?.id || "1",
          email: signupResponse.user?.email || data.email,
          name: signupResponse.user?.name || data.name,
          phone: signupResponse.user?.phone ?? data.phone,
        };

        setUser(userData);
        setTokenState(signupResponse.token);

        const authData = {
          user: userData,
          token: signupResponse.token,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: Tlogin): Promise<void> => {
    setLoading(true);
    try {
      const response = (await api.login(data.email, data.password)) as unknown;
      const loginResponse = response as {
        token?: string;
        user?: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
        };
      };

      if (loginResponse.token) {
        const userData: Tuser = {
          id: loginResponse.user?.id || "1",
          email: loginResponse.user?.email || data.email,
          name: loginResponse.user?.name || "",
          phone: loginResponse.user?.phone || "",
        };

        setUser(userData);
        setTokenState(loginResponse.token);

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
    signup,
    logout,
    setToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
