// API configuration
// export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  AUTH: {
    GITHUB: `${API_BASE_URL}/api/auth/github`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
}

