/**
 * ============================================
 * THEMES CONFIGURATION
 * ============================================
 * Material UI theme configuration following Fuse pattern
 */

export const lightPaletteText = {
  primary: '#1F232B',
  secondary: '#4B5563',
  disabled: '#9CA3AF',
};

export const darkPaletteText = {
  primary: '#E5E7EB',
  secondary: '#A5ABB5',
  disabled: '#6B7280',
};

/**
 * Shared colors for light theme
 */
const neutralsLightTheme = {
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#272F3C',
    900: '#1F232B',
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#15803D',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#B45309',
    contrastText: '#1F232B',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
};

/**
 * Shared colors for dark theme
 */
const neutralsDarkTheme = {
  grey: {
    50: '#101214',
    100: '#16181D',
    200: '#1E2026',
    300: '#25282F',
    400: '#2D3139',
    500: '#6B7280',
    600: '#8A8F99',
    700: '#A5ABB5',
    800: '#CDD1D9',
    900: '#E5E7EB',
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#15803D',
    contrastText: '#0F1115',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#B45309',
    contrastText: '#0F1115',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
};

export interface ThemeConfig {
  palette: {
    mode: 'light' | 'dark';
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    background: {
      default: string;
      paper: string;
    };
    divider: string;
    action: {
      active: string;
      hover: string;
      selected: string;
      disabled: string;
      disabledBackground: string;
      focus: string;
    };
    grey?: Record<string, string>;
    success?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    info?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    warning?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  };
}

export interface ThemesConfigType {
  [key: string]: ThemeConfig;
}

/**
 * Restaurant Admin themes - Blanco y Negro puros
 */
export const themesConfig: ThemesConfigType = {
  default: {
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',        // Negro puro
        light: '#333333',
        dark: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1565C0',        // Azul de acento
        light: '#3C83D6',
        dark: '#0E4B90',
        contrastText: '#FFFFFF',
      },
      ...neutralsLightTheme,
      text: {
        primary: '#000000',     // Texto negro
        secondary: '#666666',   // Gris oscuro
        disabled: '#999999',
      },
      background: {
        default: '#FFFFFF',     // Fondo blanco puro
        paper: '#FFFFFF',       // Paper blanco puro
      },
      divider: '#E0E0E0',
      action: {
        active: '#000000',
        hover: '#F5F5F5',
        selected: '#E0E0E0',
        disabled: '#BDBDBD',
        disabledBackground: '#F5F5F5',
        focus: '#E0E0E0',
      },
    },
  },
  defaultDark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#FFFFFF',        // Blanco puro en dark mode
        light: '#FFFFFF',
        dark: '#CCCCCC',
        contrastText: '#000000',
      },
      secondary: {
        main: '#3C83D6',        // Azul de acento
        light: '#5A9AF0',
        dark: '#1D5EB0',
        contrastText: '#FFFFFF',
      },
      ...neutralsDarkTheme,
      text: {
        primary: '#FFFFFF',     // Texto blanco
        secondary: '#AAAAAA',   // Gris claro
        disabled: '#666666',
      },
      background: {
        default: '#000000',     // Fondo negro puro
        paper: '#121212',       // Paper negro (ligeramente más claro)
      },
      divider: '#333333',
      action: {
        active: '#FFFFFF',
        hover: 'rgba(255,255,255,0.08)',
        selected: 'rgba(255,255,255,0.16)',
        disabled: 'rgba(255,255,255,0.3)',
        disabledBackground: 'rgba(255,255,255,0.12)',
        focus: 'rgba(255,255,255,0.12)',
      },
    },
  },
};

export default themesConfig;
