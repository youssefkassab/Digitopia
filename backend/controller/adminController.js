// backend/controller/adminController.js
const env = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ===== Utils =====
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

// ===== Admin Signup =====
const adminSignup = (req, res) => {
  const { email, password, masterKey } = req.body;

  if (!email || !password || !masterKey) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (masterKey !== process.env.ADMIN_MASTER_KEY) {
    return res.status(403).json({ error: "Invalid master key." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email." });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password must be 8+ chars, 1 uppercase, 1 number, 1 symbol.",
    });
  }

  db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    if (err) {
      console.error("DB error (adminSignup SELECT):", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: "Admin already exists." });
    }

    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        console.error("Hashing error (adminSignup):", err);
        return res.status(500).json({ error: "Hashing error." });
      }

      db.query(
        `INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')`,
        [email, hash],
        (err, result) => {
          if (err) {
            console.error("DB error (adminSignup INSERT):", err);
            return res.status(500).json({ error: "Database insert error." });
          }
          const createdAdmin = {
            id: result.insertId,
            email,
            role: "admin",
          };
          return res.status(201).json({
            message: "Admin created successfully.",
            admin: createdAdmin,
          });
        }
      );
    });
  });
};

// ===== Admin Login =====
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email & password required." });

  db.query(
    `SELECT * FROM users WHERE email = ? AND role = 'admin'`,
    [email],
    (err, results) => {
      if (err) {
        console.error("DB error (adminLogin SELECT):", err);
        return res.status(500).json({ error: "Database error." });
      }
      if (!results[0])
        return res.status(401).json({ error: "Admin not found." });

      const admin = results[0];
      bcrypt.compare(password, admin.password, (err, match) => {
        if (err) {
          console.error("Bcrypt error (adminLogin):", err);
          return res.status(500).json({ error: "Authentication error." });
        }
        if (!match) return res.status(401).json({ error: "Invalid password." });

        const token = jwt.sign(
          { id: admin.id, email: admin.email, role: admin.role },
          env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          token,
          admin: { id: admin.id, email: admin.email, role: admin.role },
        });
      });
    }
  );
};

// ===== Get All Students (role=user) =====
const getStudents = (req, res) => {
  db.query(
    `SELECT id, name, email, national_number, Grade 
     FROM users 
     WHERE role = 'user'`,
    (err, results) => {
      if (err) {
        console.error("DB error (getStudents):", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.json(results);
    }
  );
};

// ===== Add Student (role=user) =====
const addStudent = (req, res) => {
  const { name, email, password, national_number, Grade } = req.body;
  if (!name || !email || !password || !national_number || !Grade) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email." });
  }

  db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    if (err) {
      console.error("DB error (addStudent SELECT):", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: "Email already in use." });
    }

    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        console.error("Hashing error (addStudent):", err);
        return res.status(500).json({ error: "Hashing error." });
      }

      db.query(
        `INSERT INTO users (name, email, password, national_number, Grade, role) 
         VALUES (?, ?, ?, ?, ?, 'user')`,
        [name, email, hash, national_number, Grade],
        (err, result) => {
          if (err) {
            console.error("DB error (addStudent INSERT):", err);
            return res.status(500).json({ error: "Database insert error." });
          }
          res.status(201).json({
            message: "Student added successfully.",
            id: result.insertId,
            name,
            email,
            national_number,
            Grade,
          });
        }
      );
    });
  });
};

// ===== Delete Student =====
const deleteStudent = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM users WHERE id = ? AND role = 'user'`,
    [id],
    (err, result) => {
      if (err) {
        console.error("DB error (deleteStudent):", err);
        return res.status(500).json({ error: "Database error." });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Student not found." });
      res.json({ message: "Student deleted successfully." });
    }
  );
};

// ===== Get All Teachers =====
const getTeachers = (req, res) => {
  db.query(
    `SELECT id, name, email, national_number 
     FROM users 
     WHERE role = 'teacher'`,
    (err, results) => {
      if (err) {
        console.error("DB error (getTeachers):", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.json(results);
    }
  );
};

// ===== Add Teacher =====
// ===== Add Teacher =====
const addTeacher = (req, res) => {
  const { name, email, password, national_number } = req.body;
  if (!name || !email || !password || !national_number) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email." });
  }

  db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    if (err) {
      console.error("DB error (addTeacher SELECT):", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: "Email already in use." });
    }

    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        console.error("Hashing error (addTeacher):", err);
        return res.status(500).json({ error: "Hashing error." });
      }

      // ✅ fixed: 4 placeholders for dynamic values, role is hardcoded
      const sql = `
        INSERT INTO users (name, email, password, national_number, role) 
        VALUES (?, ?, ?, ?, 'teacher')
      `;

      db.query(sql, [name, email, hash, national_number], (err, result) => {
        if (err) {
          console.error("DB error (addTeacher INSERT):", err);
          return res.status(500).json({ error: "Database insert error." });
        }
        res.status(201).json({
          message: "Teacher added successfully.",
          id: result.insertId,
          name,
          email,
          national_number,
        });
      });
    });
  });
};

// ===== Delete Teacher =====
const deleteTeacher = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM users WHERE id = ? AND role = 'teacher'`,
    [id],
    (err, result) => {
      if (err) {
        console.error("DB error (deleteTeacher):", err);
        return res.status(500).json({ error: "Database error." });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Teacher not found." });
      res.json({ message: "Teacher deleted successfully." });
    }
  );
};

// ===== Get All Admins =====
const getAdmins = (req, res) => {
  db.query(
    `SELECT id, email FROM users WHERE role = 'admin'`,
    (err, results) => {
      if (err) {
        console.error("DB error (getAdmins):", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.json(results);
    }
  );
};

// ===== Delete Admin =====
const deleteAdmin = (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.user.id) {
    return res.status(403).json({ error: "You cannot delete yourself." });
  }

  db.query(
    `DELETE FROM users WHERE id = ? AND role = 'admin'`,
    [id],
    (err, result) => {
      if (err) {
        console.error("DB error (deleteAdmin):", err);
        return res.status(500).json({ error: "Database error." });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Admin not found." });
      res.json({ message: "Admin deleted successfully." });
    }
  );
};

module.exports = {
  adminSignup,
  adminLogin,
  getStudents,
  addStudent,
  deleteStudent,
  getTeachers,
  addTeacher,
  deleteTeacher,
  getAdmins,
  deleteAdmin,
};
