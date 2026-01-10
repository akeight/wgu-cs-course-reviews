import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
  
      if (!response.ok) {
        setUser(null);
        setAuthenticated(false);
        return;
      }
  
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Auth endpoint did not return JSON. status=${response.status} content-type=${contentType} body=${text.slice(0, 120)}`
        );
      }
  
      const data = await response.json();
  
      if (data?.authenticated) {
        setUser(data.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      setAuthenticated(false)
      // Optionally redirect to landing page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const authenticate = async () => {
    // Get current path for redirect after login
    const currentPath = window.location.pathname + window.location.search
    
    // Redirect to the server's GitHub OAuth endpoint with redirect path
    const redirectUrl = `${API_ENDPOINTS.AUTH.GITHUB}?redirect=${encodeURIComponent(currentPath)}`
    window.location.href = redirectUrl
  }

  return { user, authenticated, loading, logout, checkAuth, authenticate }
}

