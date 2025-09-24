"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  industry: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
}
interface AuthData {
  user: User | null;
  token: string;
  refreshToken: string;
  company: Company | null;
  expiresIn: string;
}

interface AuthContextType {
  authData: AuthData;
  login: (authResponse: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialAuthData: AuthData = {
  user: null,
  token: "",
  refreshToken: "",
  company: null,
  expiresIn: "",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData>(initialAuthData);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedAuthData = sessionStorage.getItem("evalence_user");
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    }
  }, []);

  const login = (authResponse: any) => {
    const newAuthData: AuthData = {
      user: authResponse.user
        ? {
            id: authResponse.user.id || "",
            firstName: authResponse.user.firstName || "",
            lastName: authResponse.user.lastName || "",
            email: authResponse.user.email || "",
            role: authResponse.user.role || "",
            phone: authResponse.user.phone || "",
            isActive: authResponse.user.isActive || false,
          }
        : null,
      token: authResponse.accessToken || "",
      refreshToken: authResponse.refreshToken || "",
      company: authResponse.company
        ? {
            id: authResponse.company.id || "",
            name: authResponse.company.name || "",
            industry: authResponse.company.industry || "",
          }
        : null,
      expiresIn: authResponse.expiresIn || "",
    };

    setAuthData(newAuthData);
    sessionStorage.setItem("evalence_user", JSON.stringify(newAuthData));
    router.push("/test");
  };

  const logout = () => {
    setAuthData(initialAuthData);
    sessionStorage.removeItem("evalence_user");
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        logout,
        isAuthenticated: !!authData.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const getStoredAuthData = () => {
  try {
    const storedData = sessionStorage.getItem("evalence_user");
    if (!storedData) return null;

    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing stored auth data:", error);
    return null;
  }
};

export const getStoredToken = (): string | null => {
  const authData = getStoredAuthData();
  return authData?.token || null;
};

export const getStoredUser = () => {
  const authData = getStoredAuthData();
  return authData?.user || null;
};
