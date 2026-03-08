/**
 * ============================================
 * SIDEBAR COMPONENT
 * ============================================
 * Navigation sidebar for the dashboard
 */

import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config';
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
        {navigationConfig.map((item) => {
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
                {Icon && (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    variant="standard"
                    max={99}
                  >
                    <Icon className="size-5 shrink-0" />
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
        })}
      </nav>

      {/* Footer: logo con nombre solo cuando está colapsado */}
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
