// API Configuration
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = envBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

export default API_BASE_URL; 