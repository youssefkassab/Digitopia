const env = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, Sequelize } = require('../db/models');
const db = require('../db/models');   // ✅ Import models
const { QueryTypes } = Sequelize;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  sequelize.query(query, { replacements: [email], type: QueryTypes.SELECT })
    .then((results) => {
      const user = results[0];
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      bcrypt.compare(password, user.password, (err, matched) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication error' });
        }
        if (!matched) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: user.id, email: user.email, role: user.role }
        });
      });
    })
    .catch(() => res.status(500).json({ error: 'Internal server error' }));
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
  if (userData.role === 'admin') {
    return res.status(400).json({ error: 'Unauthorised' });
  }
  const quer2 = `SELECT * FROM users WHERE email = ?`;
  sequelize.query(quer2, { replacements: [userData.email], type: QueryTypes.SELECT })
    .then((results) => {
      if (results.length > 0) {
        return res.status(409).json({ error: 'User already exists.' });
      }
      bcrypt.hash(userData.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error. ' + err });
        }
        const insertSql = `INSERT INTO users (email, password, role, name, national_number, Grade) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [userData.email, hash, userData.role, userData.name, userData.national_number, userData.Grade || null];
        sequelize.query(insertSql, { replacements: values, type: QueryTypes.INSERT })
          .then(() => res.status(201).json({ message: 'User created successfully.' }))
          .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e }));
      });
    })
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e }));
};

const logout = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ message: 'User logged out successfully' });
};

const user = (req, res) => {
  const quer = `SELECT id, name, email, national_number, role, Grade FROM users WHERE id = ?`;
  sequelize.query(quer, { replacements: [req.user.id], type: QueryTypes.SELECT })
    .then((results) => res.status(200).json(results[0]))
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e }));
};

const upgradeRole = (req, res) => {
  const quer = `UPDATE users SET role = ? WHERE id = ?`;
  sequelize.query(quer, { replacements: [req.body.role, req.body.id], type: QueryTypes.UPDATE })
    .then(() => res.status(200).json({ message: 'User role updated successfully.' }))
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e }));
};

// ✅ FIXED getGrade
const getGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ grade: user.Grade });
  } catch (err) {
    console.error('Error fetching grade:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
// Get full profile
const getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "Grade", "subject", "cumulative"]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update profile (subject + cumulative)
const updateProfile = async (req, res) => {
  try {
    const { subject, cumulative } = req.body;
    await db.User.update({ subject, cumulative }, { where: { id: req.user.id } });
    return res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { 
  login, signup, logout, user, upgradeRole, getGrade, getProfile, updateProfile 
};
