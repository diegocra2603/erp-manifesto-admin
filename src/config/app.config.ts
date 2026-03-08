/**
 * ============================================
 * APPLICATION CONFIGURATION
 * ============================================
 * Centralized app configuration including routes, auth, and features.
 */

export const appConfig = {
  // ==================== APP INFO ====================
  name: 'Restaurant Admin',
  description: 'Administración de restaurante',
  version: '1.0.0',

  // ==================== ROUTES ====================
  routes: {
    public: {
      login: '/login',
      forgotPassword: '/forgot-password',
    },
    private: {
      dashboard: '/admin',
      menu: '/admin/menu',
      profile: '/admin/profile',
    },
  },

  // ==================== AUTH CONFIGURATION ====================
  auth: {
    // Demo credentials (replace with real auth in production)
    demo: {
      username: 'admin',
      password: 'Admin123@',
    },
    // Storage keys
    storageKeys: {
      token: 'auth_token',
      user: 'auth_user',
      refreshToken: 'auth_refresh_token',
    },
    // Session duration (in milliseconds)
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  },

  // ==================== THEME CONFIGURATION ====================
  theme: {
    defaultMode: 'light' as 'light' | 'dark' | 'system',
    storageKey: 'theme_mode',
  },

  // ==================== FEATURE FLAGS ====================
  features: {
    darkMode: true,
    notifications: true,
    analytics: true,
    multiLanguage: false,
    realTimeUpdates: false,
  },

  // ==================== UI CONFIGURATION ====================
  ui: {
    sidebar: {
      collapsible: true,
      defaultCollapsed: false,
    },
    animations: {
      enabled: true,
      duration: 'base', // 'fast' | 'base' | 'slow'
    },
  },
} as const;

export type AppConfig = typeof appConfig;
