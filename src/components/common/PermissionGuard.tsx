/**
 * ============================================
 * PERMISSION GUARD COMPONENT
 * ============================================
 * Conditionally render children based on permissions
 */

import { type ReactNode } from 'react';
import { usePermissions } from '@/hooks';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  role?: string;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  anyPermissions,
  allPermissions,
  role,
  fallback = null,
}: PermissionGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  } = usePermissions();

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check any permissions
  if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    return <>{fallback}</>;
  }

  // Check all permissions
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    return <>{fallback}</>;
  }

  // Check role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
