const env = require('../config/config');
const jwt = require('jsonwebtoken');

const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  TEACHER: 'teacher'
};

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is required' });
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Ensure the decoded token has the required user data
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    
    // Set user data from the decoded token
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const roleAuth = (allowedRole) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Support array or single role
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (roles.includes(req.user.role) || req.user.role === ROLE.ADMIN) {
      return next();
    }
    
    // Forbidden - user is authenticated but doesn't have the required role
    return res.status(403).json({ 
      message: `Access denied. Requires role: ${roles.join(', ')}` 
    });
  };
};

module.exports = {
  auth,
  ROLE,
  roleAuth
};