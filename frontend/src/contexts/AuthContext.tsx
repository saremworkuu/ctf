import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthResponse } from '../types';
import { apiLogin, apiRegister, apiGetCart } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  userId: number;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  cartCount: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (
    username: string,
    email: string,
    password: string,
    archiveSignature: string
  ) => Promise<AuthResponse>;
  logout: () => void;
  refreshCartCount: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Refresh cart count whenever auth state changes
  const refreshCartCount = useCallback(async () => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setCartCount(0);
      return;
    }
    try {
      const items = await apiGetCart();
      setCartCount(items.reduce((acc, i) => acc + i.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshCartCount();
    } else {
      setCartCount(0);
    }
  }, [token, refreshCartCount]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function persist(data: AuthResponse) {
    const u: AuthUser = { userId: data.userId, username: data.username, role: data.role };
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async function login(username: string, password: string): Promise<AuthResponse> {
    const data = await apiLogin(username, password);
    persist(data);
    return data;
  }

  async function register(
    username: string,
    email: string,
    password: string,
    archiveSignature: string
  ): Promise<AuthResponse> {
    const data = await apiRegister(username, email, password, archiveSignature);
    persist(data);
    return data;
  }

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setCartCount(0);
  }

  const value: AuthContextValue = {
    user,
    token,
    cartCount,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    refreshCartCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
