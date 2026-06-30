// API Configuration — trim trailing slashes so `${base}/api/...` never becomes `//api`
function normalizeApiBase(url) {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/\/+$/, '');
}

const envBaseUrl = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim());
const API_BASE_URL =
  envBaseUrl ||
  (import.meta.env.DEV ? 'http://localhost:5000' : normalizeApiBase(window.location.origin));

export default API_BASE_URL; 