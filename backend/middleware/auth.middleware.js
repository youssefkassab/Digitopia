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
    if (!decoded.user || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    
    // Set user data from the decoded token
    req.user = {
      id: decoded.id,
      email: decoded.user,
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
    
    // Check if user has the required role or is an admin
    if (req.user.role === allowedRole || req.user.role === ROLE.ADMIN) {
      return next();
    }
    
    // Forbidden - user is authenticated but doesn't have the required role
    return res.status(403).json({ 
      message: `Access denied. Requires role: ${allowedRole}` 
    });
  };
};

module.exports = {
  auth,
  ROLE,
  roleAuth
};