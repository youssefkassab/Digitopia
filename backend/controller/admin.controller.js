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
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid user ID is required' });
    }

    // First check if the user exists and their role
    const userResults = await sequelize.query(
      `SELECT role FROM users WHERE id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!Array.isArray(userResults) || userResults.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found in database` });
    }

    const userCheck = userResults[0];

    // Check if the user is an admin
    if (userCheck.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users.' });
    }

    // Proceed with deletion if not admin
    const deleteResult = await sequelize.query(
      `DELETE FROM users WHERE id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
      }
    );

    // Handle both array and object responses from DELETE query
    const result = Array.isArray(deleteResult) ? deleteResult[0] : deleteResult;

    // Check if deletion was successful - be more lenient with the check
    if (result && typeof result === 'object' && result.affectedRows !== undefined && result.affectedRows === 0) {
      return res.status(404).json({ error: `User with ID ${id} was already deleted or not found` });
    }

    res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (err) {
    console.error('DB error (deleteUser):', err);
    res.status(500).json({ error: 'Database error.', details: err.message });
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
// ===== Get All Admins =====
const getAdmins = async (req, res) => {
  try {
    const [results] = await sequelize.query(
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
  deleteUser,
  getTeachers,
  getAdmins,
};
