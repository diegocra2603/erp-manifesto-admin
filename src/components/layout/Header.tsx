/**
 * ============================================
 * HEADER COMPONENT
 * ============================================
 * Top navigation header with user menu
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Bell, Search, User, LogOut, Settings, Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export function Header({ sidebarCollapsed = false, onToggleSidebar, isMobile = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300',
        isMobile ? 'left-0' : sidebarCollapsed ? 'left-20' : 'left-sidebar'
      )}
    >
      <div className="flex flex-1 items-center gap-4 px-6">
        {/* Sidebar Toggle */}
        <Tooltip title={isMobile ? 'Abrir menú' : sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}>
          <IconButton
            onClick={onToggleSidebar}
            size="small"
            sx={{ color: 'var(--color-foreground)' }}
          >
            <MenuIcon className="size-5" />
          </IconButton>
        </Tooltip>

        {/* Search - hidden on mobile */}
        {!isMobile && (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-6">
        {/* Notifications */}
        <Tooltip title="Notificaciones">
          <IconButton
            className="relative size-10 rounded-md hover:bg-accent"
            sx={{ color: 'var(--color-foreground)' }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <Bell className="size-5" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <Tooltip title="Cuenta">
          <IconButton
            onClick={handleMenuOpen}
            className="ml-2 size-10 rounded-md text-foreground hover:bg-accent"
            aria-controls={menuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              className="bg-primary text-primary-foreground"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              minWidth: 200,
              overflow: 'visible',
              bgcolor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
              filter: 'drop-shadow(0 4px 12px rgb(0 0 0 / 0.15))',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'var(--color-card)',
                borderLeft: '1px solid var(--color-border)',
                borderTop: '1px solid var(--color-border)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          MenuListProps={{
            sx: {
              '& .MuiMenuItem-root:hover': {
                bgcolor: 'var(--color-accent)',
              },
            },
          }}
        >
          <div style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
              {user?.email}
            </p>
          </div>

          <Divider sx={{ borderColor: 'var(--color-border)' }} />

          <MenuItem
            onClick={() => (window.location.href = '/admin/profile')}
            sx={{ color: 'var(--color-foreground)' }}
          >
            <ListItemIcon sx={{ color: 'var(--color-foreground)', minWidth: 36 }}>
              <User className="size-4" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>

          <MenuItem
            onClick={() => (window.location.href = '/admin/settings')}
            sx={{ color: 'var(--color-foreground)' }}
          >
            <ListItemIcon sx={{ color: 'var(--color-foreground)', minWidth: 36 }}>
              <Settings className="size-4" />
            </ListItemIcon>
            Configuración
          </MenuItem>

          <Divider sx={{ borderColor: 'var(--color-border)' }} />

          <MenuItem onClick={handleLogout} sx={{ color: 'var(--color-error)' }}>
            <ListItemIcon sx={{ color: 'var(--color-error)', minWidth: 36 }}>
              <LogOut className="size-4" />
            </ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
