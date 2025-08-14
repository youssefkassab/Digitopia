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
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  const quer =`SELECT * FROM users WHERE email = ?`;
  db.query(quer, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
    const user = results[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }
      if (result) {
        // Include user ID, email, and role in the JWT token
        const token = jwt.sign(
          { 
            id: user.id,
            user: user.email,
            role: user.role 
          }, 
          env.JWT_SECRET,
          { expiresIn: '1h' } // Token expires in 1 hour
        );
        return res.status(200).json({ token, id: user.id });
      }
      return res.status(401).json({ error: 'Invalid email or password.' });
    }); 
  });
}

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
      return res.status(500).json({ error: 'Internal server error.' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    bcrypt.hash(userData.password,10,(err,hash)=>{
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }
      db.query(quer, {email: userData.email, password: hash , role: userData.role}, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error.' });
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
      return res.status(500).json({ error: 'Internal server error.' });
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