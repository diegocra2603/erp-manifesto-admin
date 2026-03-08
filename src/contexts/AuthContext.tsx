/**
 * ============================================
 * AUTH CONTEXT
 * ============================================
 * Manages authentication state and operations
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { appConfig } from '@/config';
import type { LoginResponse, ApiErrorResponse, ApiUser, JWTPayload } from '@/lib/api-types';
import { parseApiError, isApiError } from '@/lib/api-helpers';

interface User extends ApiUser {
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract permissions from JWT token
  const extractPermissions = (token: string): string[] => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.permission || [];
    } catch {
      return [];
    }
  };

  // Create User object from API response and token
  const createUserFromResponse = (apiUser: ApiUser, token: string): User => {
    const permissions = extractPermissions(token);

    return {
      ...apiUser,
      permissions,
    };
  };

  // Verify token with backend
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data: LoginResponse = await response.json();

      if (data.accessToken && data.accessToken !== token) {
        localStorage.setItem(appConfig.auth.storageKeys.token, data.accessToken);

        if (data.user) {
          const userData = createUserFromResponse(data.user, data.accessToken);
          localStorage.setItem(appConfig.auth.storageKeys.user, JSON.stringify(userData));
          setUser(userData);
        }
      }

      return true;
    } catch (error) {
      console.warn('[AuthContext] Error verifying token:', error);
      return false;
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(appConfig.auth.storageKeys.token);
      const storedUser = localStorage.getItem(appConfig.auth.storageKeys.user);

      if (token && storedUser) {
        try {
          // First set user from storage (faster)
          setUser(JSON.parse(storedUser));

          // Then verify token with backend
          const isValid = await verifyToken(token);

          if (!isValid) {
            // Token invalid, clear everything
            localStorage.removeItem(appConfig.auth.storageKeys.token);
            localStorage.removeItem(appConfig.auth.storageKeys.user);
            setUser(null);
          }
        } catch {
          localStorage.removeItem(appConfig.auth.storageKeys.token);
          localStorage.removeItem(appConfig.auth.storageKeys.user);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Call our API endpoint (which calls the backend)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check if it's an error response
      if (!response.ok || isApiError(data)) {
        const errorMessage = isApiError(data)
          ? parseApiError(data)
          : 'Error al iniciar sesión';

        setIsLoading(false);
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Success - we have the login response
      const loginResponse: LoginResponse = data;

      // Check if user data is present
      if (!loginResponse.user) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Error al procesar los datos del usuario',
        };
      }

      // Create user object with permissions from token
      const userData = createUserFromResponse(
        loginResponse.user,
        loginResponse.accessToken
      );

      // Store token and user data
      localStorage.setItem(appConfig.auth.storageKeys.token, loginResponse.accessToken);
      localStorage.setItem(appConfig.auth.storageKeys.user, JSON.stringify(userData));

      setUser(userData);
      setIsLoading(false);

      return { success: true };
    } catch {
      setIsLoading(false);
      return {
        success: false,
        error: 'Error de conexión. Por favor intenta de nuevo.',
      };
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem(appConfig.auth.storageKeys.token);
    localStorage.removeItem(appConfig.auth.storageKeys.user);

    setUser(null);

    // Redirect to login
    window.location.href = appConfig.routes.public.login;
  };

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem(appConfig.auth.storageKeys.token);

    if (!token || !user) {
      return false;
    }

    // Verify token is still valid
    return await verifyToken(token);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
