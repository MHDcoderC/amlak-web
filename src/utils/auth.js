import axios from 'axios';
import API_BASE_URL from '../config/api';

// Token management with security
class AuthManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
    this.refreshKey = 'auth_refresh';
    this.lastActivityKey = 'auth_last_activity';
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  // Secure token storage with encryption simulation
  setToken(token) {
    try {
      // In production, use proper encryption
      const encryptedToken = btoa(token); // Base64 encoding (basic)
      localStorage.setItem(this.tokenKey, encryptedToken);
      this.updateLastActivity();
    } catch (error) {
      console.error('Token storage error:', error);
    }
  }

  getToken() {
    try {
      const encryptedToken = localStorage.getItem(this.tokenKey);
      if (!encryptedToken) return null;
      
      // Decode token
      const token = atob(encryptedToken);
      
      // Check if token is expired
      if (this.isTokenExpired(token)) {
        this.clearAuth();
        return null;
      }
      
      // Check session timeout
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
      const userData = JSON.stringify(user);
      // Use encodeURIComponent to handle Persian characters
      const encryptedUser = btoa(encodeURIComponent(userData));
      localStorage.setItem(this.userKey, encryptedUser);
    } catch (error) {
      console.error('User storage error:', error);
    }
  }

  getUser() {
    try {
      const encryptedUser = localStorage.getItem(this.userKey);
      if (!encryptedUser) return null;
      
      const userData = decodeURIComponent(atob(encryptedUser));
      return JSON.parse(userData);
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshKey);
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

  // Auto-refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshKey);
      if (!refreshToken) return false;

      const response = await axios.post(`${API_BASE_URL}/api/users/refresh`, {
        refreshToken
      });

      this.setToken(response.data.token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return false;
    }
  }
}

// Create axios interceptor for automatic token handling
const setupAxiosInterceptors = (authManager) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = authManager.getToken();
      if (token) {
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh token
        const refreshed = await authManager.refreshToken();
        if (refreshed) {
          const token = authManager.getToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } else {
          // Refresh failed, logout user
          authManager.logout();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Create and export auth manager instance
const authManager = new AuthManager();
setupAxiosInterceptors(authManager);

export default authManager;
