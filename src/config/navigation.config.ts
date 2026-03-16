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
  {
    id: 'accounting',
    label: 'Contabilidad',
    href: '/admin/accounting',
    icon: 'BookOpen',
    children: [
      {
        id: 'account-catalog',
        label: 'Catálogo de Cuentas',
        href: '/admin/accounting/account-catalog',
        icon: 'FolderTree',
      },
      {
        id: 'journal-entries',
        label: 'Partidas Contables',
        href: '/admin/accounting/journal-entries',
        icon: 'ClipboardList',
      },
      {
        id: 'accounting-periods',
        label: 'Períodos Contables',
        href: '/admin/accounting/periods',
        icon: 'Calendar',
      },
      {
        id: 'clients',
        label: 'Clientes',
        href: '/admin/accounting/clients',
        icon: 'UserCheck',
      },
      {
        id: 'accounts-receivable',
        label: 'Cuentas por Cobrar',
        href: '/admin/accounting/receivable',
        icon: 'TrendingUp',
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        href: '/admin/accounting/suppliers',
        icon: 'Truck',
      },
      {
        id: 'accounts-payable',
        label: 'Cuentas por Pagar',
        href: '/admin/accounting/payable',
        icon: 'TrendingDown',
      },
      {
        id: 'currencies',
        label: 'Configuración de Moneda',
        href: '/admin/accounting/currencies',
        icon: 'CircleDollarSign',
      },
      {
        id: 'tax-config',
        label: 'Configuración de Impuestos',
        href: '/admin/accounting/tax-config',
        icon: 'Receipt',
      },
    ],
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
