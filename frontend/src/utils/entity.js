import API_BASE_URL from '../config/api';

export const getEntityId = (entity) => entity?.id || entity?._id || null;

export const buildMediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE_URL.replace(/\/$/, '');
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
};

