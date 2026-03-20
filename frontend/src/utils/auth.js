import axios from 'axios';
import API_BASE_URL from '../config/api';

// Centralized auth state manager for local storage and axios.
class AuthManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
    this.lastActivityKey = 'auth_last_activity';
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  setToken(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
      this.updateLastActivity();
    } catch (error) {
      console.error('Token storage error:', error);
    }
  }

  getToken() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      if (!token) return null;

      if (this.isTokenExpired(token)) {
        this.clearAuth();
        return null;
      }

      if (this.isSessionExpired()) {
        this.clearAuth();
        return null;
      }

      this.updateLastActivity();
      return token;
    } catch (error) {
      console.error('Token retrieval error:', error);
      this.clearAuth();
      return null;
    }
  }

  setUser(user) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (error) {
      console.error('User storage error:', error);
    }
  }

  getUser() {
    try {
      const rawUser = localStorage.getItem(this.userKey);
      if (!rawUser) return null;

      return JSON.parse(rawUser);
    } catch (error) {
      console.error('User retrieval error:', error);
      this.clearAuth();
      return null;
    }
  }

  updateLastActivity() {
    localStorage.setItem(this.lastActivityKey, Date.now().toString());
  }

  isSessionExpired() {
    const lastActivity = localStorage.getItem(this.lastActivityKey);
    if (!lastActivity) return true;
    
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    return timeSinceLastActivity > this.sessionTimeout;
  }

  isTokenExpired(token) {
    try {
      const payloadPart = token.split('.')[1];
      // JWT payload is base64url (uses '-' '_' instead of '+' '/')
      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = normalized.length % 4;
      const padded = padLength ? `${normalized}${'='.repeat(4 - padLength)}` : normalized;
      const payload = JSON.parse(atob(padded));
      return typeof payload?.exp !== 'number' ? true : (payload.exp * 1000 < Date.now());
    } catch {
      return true;
    }
  }

  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.lastActivityKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Secure logout
  logout() {
    this.clearAuth();
    // Redirect to home page
    window.location.href = '/';
  }

}

// Create axios interceptor for automatic token handling
const setupAxiosInterceptors = (authManager) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = authManager.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        authManager.logout();
      }

      return Promise.reject(error);
    }
  );
};

// Create and export auth manager instance
const authManager = new AuthManager();
setupAxiosInterceptors(authManager);

export default authManager;
