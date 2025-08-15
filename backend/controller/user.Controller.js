const env = require( '../config/config')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}
//TODO: ask karim about user data sending with the login or creat a api for it
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Debug: Log the incoming request
    console.log('Login attempt for email:', email);
    
    // Get user from database
    const quer = `SELECT * FROM users WHERE email = ?`;
    db.query(quer, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      
      // Check if user exists
      const user = results[0];
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      
      // Debug: Log the comparison details
      console.log('Password comparison details:', {
        inputPassword: password,
        storedHash: user.password ? 'Hash exists' : 'No hash found',
        hashLength: user.password ? user.password.length : 0
      });
      
      // Compare passwords
      bcrypt.compare(password, user.password, (err, result) => {
        console.log('bcrypt.compare result:', { result, error: err });
        
        if (err) {
          console.error('bcrypt.compare error:', err);
          return res.status(500).json({ 
            error: 'Authentication error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }
        
        if (!result) {
          console.log('Password comparison failed for user:', email);
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
        
        // Create JWT token
        try {
          console.log('Creating JWT token for user:', { 
            id: user.id, 
            email: user.email,
            role: user.role 
          });
          
          const token = jwt.sign(
            { 
              id: user.id,
              email: user.email,
              role: user.role 
            }, 
            env.JWT_SECRET,
            { expiresIn: '1h' }
          );
          
          console.log('Login successful for user:', user.email);
          return res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          });
          
        } catch (tokenError) {
          console.error('JWT token creation failed:', tokenError);
          return res.status(500).json({ 
            error: 'Authentication error',
            details: 'Failed to create authentication token'
          });
        }
      });
    });
    
  } catch (error) {
    console.error('Unexpected error in login:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const signup = (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.password || !userData.role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }
  if (!isValidEmail(userData.email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!isStrongPassword(userData.password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and contain letters and numbers.' });
  }
  const quer = `INSERT INTO users SET ?`;
  const quer2 = `SELECT * FROM users WHERE email = ?`;
  db.query(quer2, [userData.email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error. ' + err });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    bcrypt.hash(userData.password,10,(err,hash)=>{
      if (err) {
        return res.status(500).json({ error: 'Internal server error. ' + err });
      }
      db.query(quer, {email: userData.email, password: hash , role: userData.role}, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error. ' + err });
        }
        return res.status(201).json({ message: 'User created successfully.' });
      });
    });
  });
}

const logout = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ message: 'User logged out successfully' });
}
const user = (req, res) => {
  const quer = `SELECT * FROM users WHERE id = ?`;
  db.query(quer, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error. ' + err });
    }
    return res.status(200).json(results[0]); 
  });
}
module.exports = {
  login,
  signup,
  logout,
  user
}