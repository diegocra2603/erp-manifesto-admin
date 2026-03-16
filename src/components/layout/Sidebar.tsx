/**
 * ============================================
 * SIDEBAR COMPONENT
 * ============================================
 * Navigation sidebar for the dashboard
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { navigationConfig, bottomNavigationConfig, type NavigationItem } from '@/config';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Leaf,
  SlidersHorizontal,
  FolderTree,
  ClipboardList,
  ChefHat,
  ShoppingCart,
  Calendar,
  Users,
  UserCog,
  BarChart3,
  Settings,
  Store,
  Briefcase,
  FileQuestion,
  BookOpen,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Receipt,
  UserCheck,
  Truck,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  UtensilsCrossed,
  Leaf,
  SlidersHorizontal,
  FolderTree,
  ClipboardList,
  ChefHat,
  ShoppingCart,
  Calendar,
  Users,
  UserCog,
  BarChart3,
  Settings,
  Store,
  Briefcase,
  FileQuestion,
  BookOpen,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Receipt,
  UserCheck,
  Truck,
};

interface SidebarProps {
  currentPath?: string;
  collapsed?: boolean;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  currentPath = '/admin',
  collapsed = false,
  isMobile = false,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const theme = useTheme();
  const showExpanded = isMobile || !collapsed;
  const isDark = theme.palette.mode === 'dark';
  const logoSrc = isDark
    ? '/assets/logo/logo-manifesto-blanco.svg'
    : '/assets/logo/logo-manifesto-negro.svg';
  const logoNombreSrc = isDark
    ? '/assets/logo/logo-manifesto-nombre-blanco.svg'
    : '/assets/logo/logo-manifesto-nombre-negro.svg';

  // Track which collapsible sections are open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Auto-open section if current path is within it
    const initial: Record<string, boolean> = {};
    navigationConfig.forEach((item) => {
      if (item.children && currentPath?.startsWith(item.href)) {
        initial[item.id] = true;
      }
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNavItem = (item: NavigationItem, isChild = false) => {
    const Icon = item.icon ? iconMap[item.icon] : null;
    const isActive = currentPath === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections[item.id] ?? false;
    const isParentActive = hasChildren && currentPath?.startsWith(item.href);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <Tooltip
            title={!showExpanded ? item.label : ''}
            placement="right"
          >
            <button
              onClick={() => toggleSection(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                isParentActive
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {Icon && <Icon className="size-5 shrink-0" />}
              {showExpanded && (
                <>
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  {isOpen ? (
                    <ChevronDown className="size-4 shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0" />
                  )}
                </>
              )}
            </button>
          </Tooltip>
          {showExpanded && isOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
              {item.children!.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Tooltip
        key={item.id}
        title={!showExpanded ? item.label : ''}
        placement="right"
      >
        <a
          href={item.href}
          onClick={isMobile ? onClose : undefined}
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 text-sm font-medium transition-all',
            isChild ? 'py-2' : 'py-2.5',
            'hover:bg-accent hover:text-accent-foreground',
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground'
          )}
        >
          {Icon && (
            <Badge
              badgeContent={item.badge}
              color="error"
              variant="standard"
              max={99}
            >
              <Icon className={cn('shrink-0', isChild ? 'size-4' : 'size-5')} />
            </Badge>
          )}

          {showExpanded && (
            <span className="flex-1 truncate">{item.label}</span>
          )}

          {showExpanded && item.badge && (
            <span className="flex size-5 items-center justify-center rounded-full bg-error text-[10px] font-semibold text-error-foreground">
              {item.badge}
            </span>
          )}
        </a>
      </Tooltip>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
        isMobile
          ? cn('w-sidebar', mobileOpen ? 'translate-x-0' : '-translate-x-full')
          : cn(collapsed ? 'w-20' : 'w-sidebar')
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 shrink-0 items-center border-b border-border', !showExpanded ? 'justify-center px-2' : 'justify-between px-4')}>
        <div className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="Restaurant Logo"
            className="size-14 min-h-14 min-w-14 shrink-0 object-contain"
          />
          {showExpanded && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">Manifesto</span>
              <span className="text-sm text-muted-foreground">Administrador</span>
            </div>
          )}
        </div>
        {isMobile && mobileOpen && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'var(--color-foreground)' }}
          >
            <X className="size-5" />
          </IconButton>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigationConfig.map((item) => renderNavItem(item))}
      </nav>

      {/* Bottom Navigation (Settings, etc.) */}
      <div className="shrink-0 border-t border-border p-3 space-y-1">
        {bottomNavigationConfig.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;
          const isActive = currentPath === item.href;

          return (
            <Tooltip
              key={item.id}
              title={!showExpanded ? item.label : ''}
              placement="right"
            >
              <a
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className="size-5 shrink-0" />}
                {showExpanded && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </a>
            </Tooltip>
          );
        })}
      </div>

      {/* Footer: logo con nombre solo cuando está expandido */}
      {showExpanded && (
        <div className="flex shrink-0 items-center justify-center border-t border-border px-2 py-4">
          <img
            src={logoNombreSrc}
            alt="Manifesto"
            className="h-6 w-auto object-contain"
          />
        </div>
      )}
    </aside>
  );
}
