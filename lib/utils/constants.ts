export const APP_NAME = 'F Solar';
export const APP_DESCRIPTION = 'A collaborative workspace application';
export const APP_VERSION = '0.1.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/documents',
  DOCUMENT: (id: string) => `/documents/${id}`,
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  DOCUMENTS: '/api/documents',
  DOCUMENT: (id: string) => `/api/documents/${id}`,
  PROJECTS: '/api/projects',
  SYNC: '/api/sync',
  GOOGLE_DRIVE: {
    AUTH: '/api/google-drive/auth',
    CALLBACK: '/api/google-drive/callback',
    FILES: '/api/google-drive/files',
    SYNC: '/api/google-drive/sync',
  },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
] as const;

export const OFFLINE_DB_NAME = 'f_solar_offline';
export const OFFLINE_DB_VERSION = 1;

export const CACHE_KEYS = {
  USER: 'user',
  WORKSPACE: 'workspace',
  DOCUMENTS: 'documents',
  PROJECTS: 'projects',
} as const;
