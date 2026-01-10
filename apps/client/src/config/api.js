// API configuration
const DEV_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// In production, use same-origin so Vercel can proxy (/api -> Cloud Run)
export const API_BASE_URL = import.meta.env.PROD ? "" : DEV_BASE;

export const API_ENDPOINTS = {
  AUTH: {
    GITHUB: `${API_BASE_URL}/api/auth/github`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
};

