const { sequelize } = require("../db/models");

const getStudents = async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT id, name, email, national_number, Grade
       FROM users
       WHERE role = :role`,
      {
        replacements: { role: "user" },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(results); // results is already an array
  } catch (err) {
    console.error("DB error (getStudents):", err);
    res.status(500).json({ error: "Database error." });
  }
};

// ===== Delete Student =====
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Use sequelize.query and check affectedRows differently for DELETE
    const [result, metadata] = await sequelize.query(
      `DELETE FROM users WHERE id = :id AND role = :role`,
      {
        replacements: { id, role: "user" },
      }
    );

    if (!metadata || metadata.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ message: "Student deleted successfully." });
  } catch (err) {
    console.error("DB error (deleteStudent):", err);
    res.status(500).json({ error: "Database error." });
  }
};

// ===== Get All Teachers =====
const getTeachers = async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT id, name, email, national_number
       FROM users
       WHERE role = :role`,
      {
        replacements: { role: "teacher" },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(results); // send the array directly
  } catch (err) {
    console.error("DB error (getTeachers):", err);
    res.status(500).json({ error: "Database error." });
  }
};

// ===== Delete Teacher =====
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const [result, metadata] = await sequelize.query(
      `DELETE FROM users WHERE id = :id AND role = :role`,
      {
        replacements: { id, role: "teacher" },
      }
    );

    if (!metadata || metadata.affectedRows === 0) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    res.json({ message: "Teacher deleted successfully." });
  } catch (err) {
    console.error("DB error (deleteTeacher):", err);
    res.status(500).json({ error: "Database error." });
  }
};

// ===== Get All Admins =====
const getAdmins = async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT id, email FROM users WHERE role = :role`,
      {
        replacements: { role: "admin" },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(results);
  } catch (err) {
    console.error("DB error (getAdmins):", err);
    res.status(500).json({ error: "Database error." });
  }
};

module.exports = {
  getStudents,
  deleteStudent,
  getTeachers,
  deleteTeacher,
  getAdmins,
};
