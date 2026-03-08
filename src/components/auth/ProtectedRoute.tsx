/**
 * ============================================
 * PROTECTED ROUTE COMPONENT
 * ============================================
 * Wrapper component to protect routes that require authentication
 */

import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { appConfig } from '@/config';
import CircularProgress from '@mui/material/CircularProgress';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        window.location.href = appConfig.routes.public.login;
        return;
      }

      // Verify token with backend
      try {
        const isValid = await checkAuth();

        if (!isValid) {
          // Token is invalid, logout and redirect
          logout();
          return;
        }

        setIsVerifying(false);
      } catch {
        logout();
      }
    };

    verifyAuth();
  }, [isAuthenticated, isLoading]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <CircularProgress size={40} />
          <p className="mt-4 text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Permisos validados por el backend, no en el frontend
  return <>{children}</>;
}
