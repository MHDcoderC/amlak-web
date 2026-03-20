const jwt = require('jsonwebtoken');

/**
 * Parse and verify JWT from Authorization header.
 * Rejects requests that miss tokens or use invalid/expired tokens.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Restrict route access to admin users only.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  return next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
