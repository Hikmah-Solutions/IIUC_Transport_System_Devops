const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedError('Authorization header is missing');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('Token is missing');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role-based access control
      if (roles.length && !roles.includes(decoded.role)) {
        throw new UnauthorizedError('Access denied: insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // JWT specific errors
        return res.status(401).json({ message: 'Invalid or expired token' });
      } else if (error instanceof UnauthorizedError) {
        // Custom unauthorized errors
        return res.status(401).json({ message: error.message });
      } else {
        // General errors
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
};

module.exports = authMiddleware;