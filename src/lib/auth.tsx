"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  industry: string;
  phone?: string;
  website?: string;
  status?: string;
  createdAt?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthData {
  user: User | null;
  accessToken: string;
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
  accessToken: "",
  refreshToken: "",
  company: null,
  expiresIn: "",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData>(initialAuthData);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedAuthData = localStorage.getItem("evalence_user");
    if (storedAuthData) {
      try {
        setAuthData(JSON.parse(storedAuthData));
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("evalence_user");
      }
    }
  }, []);

  const login = (authResponse: any) => {
    // Handle both the existing API response format and the Google auth format
    const newAuthData: AuthData = {
      user: authResponse.user || (authResponse.data?.user ? {
        id: authResponse.data.user.id || "",
        firstName: authResponse.data.user.firstName || "",
        lastName: authResponse.data.user.lastName || "",
        email: authResponse.data.user.email || "",
        role: authResponse.data.user.role || authResponse.user?.role || "",
        phone: authResponse.data.user.phone || authResponse.user?.phone || "",
        isActive: authResponse.data.user.isActive ?? authResponse.user?.isActive ?? true,
        lastLoginAt: authResponse.data.user.lastLoginAt || authResponse.user?.lastLoginAt || "",
        createdAt: authResponse.data.user.createdAt || authResponse.user?.createdAt || "",
      } : null),
      accessToken: authResponse.accessToken || authResponse.access_token || "",
      refreshToken: authResponse.refreshToken || authResponse.refresh_token || "",
      company: authResponse.company || (authResponse.data?.company ? {
        id: authResponse.data.company.id || "",
        name: authResponse.data.company.name || "",
        industry: authResponse.data.company.industry || "",
        phone: authResponse.data.company.phone || "",
        website: authResponse.data.company.website || "",
        status: authResponse.data.company.status || "",
        createdAt: authResponse.data.company.createdAt || "",
      } : null),
      expiresIn: authResponse.expiresIn || "1h",
    };

    setAuthData(newAuthData);
    localStorage.setItem("evalence_user", JSON.stringify(newAuthData));
    // Only redirect if we're not in the Google callback flow
    if (typeof window !== 'undefined' && !window.location.pathname.includes('google-callback')) {
      router.push("/");
    }
  };

  const logout = () => {
    setAuthData(initialAuthData);
    localStorage.removeItem("evalence_user");
    router.push("/auth/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        logout,
        isAuthenticated: !!authData.accessToken,
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
    const storedData = localStorage.getItem("evalence_user");
    if (!storedData) return null;

    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing stored auth data:", error);
    return null;
  }
};

export const getStoredToken = (): string | null => {
  const authData = getStoredAuthData();
  return authData?.accessToken || null;
};

export const getStoredUser = () => {
  const authData = getStoredAuthData();
  return authData?.user || null;
};