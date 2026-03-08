/**
 * ============================================
 * USE PERMISSIONS HOOK
 * ============================================
 * Hook to check user permissions
 */

import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    return user.permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    return permissions.some((permission) => user.permissions.includes(permission));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    return permissions.every((permission) => user.permissions.includes(permission));
  };

  /**
   * Check if user has admin full access
   */
  const isAdmin = (): boolean => {
    return hasPermission('Admin.FullAccess');
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (roleName: string): boolean => {
    if (!user || !user.role) {
      return false;
    }

    return user.role.name === roleName;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    hasRole,
    permissions: user?.permissions || [],
    role: user?.role,
  };
}
