/**
 * ============================================
 * THEME CONFIGURATION
 * ============================================
 * Centralized theme configuration for the entire application.
 * Modify fonts, colors, and other theme settings here.
 */

export const themeConfig = {
  // ==================== TYPOGRAPHY ====================
  fonts: {
    // Primary font for headings and important text
    heading: {
      family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
    // Body font for regular text
    body: {
      family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
      },
    },
    // Monospace font for code
    mono: {
      family: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
      weights: {
        normal: 400,
        medium: 500,
      },
    },
  },

  // ==================== FONT SIZES ====================
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },

  // ==================== SPACING ====================
  spacing: {
    sidebar: {
      width: '280px',
      collapsedWidth: '80px',
    },
    header: {
      height: '64px',
    },
    footer: {
      height: '48px',
    },
  },

  // ==================== COLORS ====================
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#000000',
      primaryForeground: '#ffffff',
      secondary: '#f5f5f5',
      secondaryForeground: '#000000',
      muted: '#f0f0f0',
      mutedForeground: '#666666',
      border: '#e5e5e5',
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#fafafa',
      primary: '#fafafa',
      primaryForeground: '#0a0a0a',
      secondary: '#1a1a1a',
      secondaryForeground: '#fafafa',
      muted: '#262626',
      mutedForeground: '#a3a3a3',
      border: '#333333',
    },
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
