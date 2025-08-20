// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'http://amlak.venusbox.ir');

export default API_BASE_URL; 