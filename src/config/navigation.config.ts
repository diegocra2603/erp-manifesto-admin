/**
 * ============================================
 * NAVIGATION CONFIGURATION
 * ============================================
 * Centralized navigation structure for the dashboard.
 */

import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string; // Icon name from lucide-react
  badge?: string | number;
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  {
    id: 'users',
    label: 'Usuarios',
    href: '/admin/users',
    icon: 'Users',
  },
  {
    id: 'job-positions',
    label: 'Puestos de Trabajo',
    href: '/admin/job-positions',
    icon: 'Briefcase',
  },
  {
    id: 'products',
    label: 'Productos',
    href: '/admin/products',
    icon: 'Store',
  },
] as const;

/**
 * Bottom navigation items (shown at the bottom of the sidebar, outside the main list)
 */
export const bottomNavigationConfig: NavigationItem[] = [
  {
    id: 'settings',
    label: 'Configuración',
    href: '/admin/settings',
    icon: 'Settings',
  },
] as const;
