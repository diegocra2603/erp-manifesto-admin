/**
 * ============================================
 * THEME CONTEXT
 * ============================================
 * Theme management with Material UI integration (Fuse pattern)
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, type Theme as MuiTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { appConfig } from '@/config';
import themesConfig from '@/config/themes.config';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(appConfig.theme.defaultMode);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);
  const [muiTheme, setMuiTheme] = useState<MuiTheme>(createTheme(themesConfig.default));

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(appConfig.theme.storageKey) as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved: ResolvedTheme;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      resolved = systemTheme;
    } else {
      resolved = theme;
    }

    // Update Material UI theme
    const themeConfig = resolved === 'dark' ? themesConfig.defaultDark : themesConfig.default;
    const newMuiTheme = createTheme({
      ...themeConfig,
      typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontSize: 13,
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: themeConfig.palette.background.paper,
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
      },
    });

    setMuiTheme(newMuiTheme);

    // Update HTML/Body classes for Tailwind
    root.classList.add(resolved);
    document.body.classList.add(resolved);
    document.body.classList.remove(resolved === 'light' ? 'dark' : 'light');
    setResolvedTheme(resolved);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolved === 'dark' ? '#0F1115' : '#F6F7F8'
      );
    }
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);

      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(appConfig.theme.storageKey, newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: muiTheme.palette.background.paper,
    },
    '& .border-divider': {
      borderColor: `${muiTheme.palette.divider}!important`,
    },
    '[class^="border"]': {
      borderColor: muiTheme.palette.divider,
    },
    '[class*="border"]': {
      borderColor: muiTheme.palette.divider,
    },
    hr: {
      borderColor: muiTheme.palette.divider,
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: {
              backgroundColor: muiTheme.palette.background.default,
              color: muiTheme.palette.text.primary,
            },
            body: {
              backgroundColor: muiTheme.palette.background.default,
              color: muiTheme.palette.text.primary,
            },
            ...baseStyles,
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
