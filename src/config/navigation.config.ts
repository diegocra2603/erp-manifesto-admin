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
] as const;
