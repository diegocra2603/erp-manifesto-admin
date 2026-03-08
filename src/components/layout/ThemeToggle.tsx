/**
 * ============================================
 * THEME TOGGLE COMPONENT
 * ============================================
 * Button to toggle between light and dark mode
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Cambiar a modo ${resolvedTheme === 'dark' ? 'claro' : 'oscuro'}`}>
      <IconButton
        onClick={toggleTheme}
        className="relative size-10 rounded-md transition-colors hover:bg-accent"
        sx={{ color: 'var(--color-foreground)' }}
        aria-label="Toggle theme"
      >
        <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </IconButton>
    </Tooltip>
  );
}
