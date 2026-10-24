"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { loginWithGoogle, loginAsRole, logoutUser, MOCK_USERS } from "@/lib/firebase/auth";
import { api } from "@/lib/api/client";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to Harshh (Customer) as seen in the reference screenshot: "Hello, Harshh"
  const [user, setUser] = useState<User | null>(MOCK_USERS.customer);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for persisted session
    try {
      const savedUser = localStorage.getItem("kaarigar_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.id === "usr_harshh" && (!parsed.avatar || parsed.avatar.includes("suresh"))) {
          parsed.avatar = "/images/artisans/harshh.webp";
          localStorage.setItem("kaarigar_user", JSON.stringify(parsed));
        }
        setUser(parsed);
        api.setToken(`token-${parsed.id}`);
      } else {
        // Persist default demo user
        localStorage.setItem("kaarigar_user", JSON.stringify(MOCK_USERS.customer));
        api.setToken("mock-firebase-jwt-token-harshh");
      }
    } catch {
      // LocalStorage not available (e.g. incognito/testing)
    }
  }, []);

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      setUser(res.user);
      api.setToken(res.token);
      localStorage.setItem("kaarigar_user", JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      const res = await loginAsRole(targetRole);
      setUser(res.user);
      api.setToken(res.token);
      localStorage.setItem("kaarigar_user", JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      api.setToken(null);
      localStorage.removeItem("kaarigar_user");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("kaarigar_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        loginGoogle,
        switchRole,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
