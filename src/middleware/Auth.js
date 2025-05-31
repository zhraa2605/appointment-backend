const jwt = require('../utils/jwt');

// ✅ Middleware: Verify token from cookie and attach user info
exports.Auth = (req, res, next) => {
  const token = req.cookies?.token; //  Get token from cookie
  if (!token) {
    return res.status(401).json({ msg: 'No token provided in cookies' });
  }

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

// ✅ Middleware: Check for specific role
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ msg: `Access denied: ${role}s only ` });
    }
    next();
  };
};
