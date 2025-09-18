const db = require("../config/db");

const checkTeacherExists = (teacher_id) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT id FROM users WHERE id = ? AND role = "teacher"';
    db.query(q, [teacher_id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject("Teacher does not exist");
      resolve(true);
    });
  });
};

const createCourse = async (req, res) => {
  const courseData = req.body;

  try {
    // If a file was uploaded, store its filename or path
    if (req.file) {
      courseData.video = req.file.filename;
      // or: courseData.video = `/uploads/courses/${req.file.filename}`;
    }

    if (req.user.role === "admin") {
      if (
        !courseData.name ||
        !courseData.description ||
        !courseData.price ||
        !courseData.teacher_id
      ) {
        return res.status(400).json({
          error: "Name, description, price, and teacher id are required.",
        });
      }

      await checkTeacherExists(courseData.teacher_id);

      const quer = `INSERT INTO courses SET ?`;
      db.query(quer, courseData, (err, results) => {
        if (err)
          return res.status(500).json({ error: "Internal server error." });
        return res
          .status(201)
          .json({ message: "Course created successfully." });
      });
    } else {
      if (!courseData.name || !courseData.description || !courseData.price) {
        return res
          .status(400)
          .json({ error: "Name, description, and price are required." });
      }

      // Set teacher_id for non-admin users
      courseData.teacher_id = req.user.id;

      const quer = `INSERT INTO courses SET ?`;
      db.query(quer, courseData, (err, results) => {
        if (err)
          return res.status(500).json({ error: "Internal server error." });
        return res
          .status(201)
          .json({ message: "Course created successfully." });
      });
    }
  } catch (err) {
    return res.status(400).json({ error: err.toString() });
  }
};

const getAllCourses = (req, res) => {
  let quer = `SELECT * FROM courses`;
  db.query(quer, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
    return res.status(200).json(results);
  });
};
const getAllTeacherCourses = (req, res) => {
  let quer = `SELECT * FROM courses WHERE teacher_id = ?`;
  if (req.user.role === "admin") {
    quer = `SELECT * FROM courses`;
  }
  db.query(quer, [req.user.id || req.user.role === "admin"], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
    return res.status(200).json(results);
  });
};
const getCourseById = (req, res) => {
  let quer = `SELECT * FROM courses WHERE id = ? AND teacher_id = ?`;
  if (req.user.role === "admin") {
    quer = `SELECT * FROM courses WHERE id = ?`;
  }
  db.query(
    quer,
    [req.body.id, req.user.id || req.user.role === "admin"],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error." });
      }
      return res.status(200).json(results[0]);
    }
  );
};
const updateCourse = async (req, res) => {
  const courseData = req.body;
  let quer, params;

  try {
    if (courseData.teacher_id) {
      // If teacher_id is being updated, check it exists
      await checkTeacherExists(courseData.teacher_id);
    }

    if (req.user.role === "admin") {
      quer = `UPDATE courses SET ? WHERE id = ?`;
      params = [courseData, req.body.id];
    } else {
      quer = `UPDATE courses SET ? WHERE id = ? AND teacher_id = ?`;
      params = [courseData, req.body.id, req.user.id];
    }

    db.query(quer, params, (err, results) => {
      if (err) {
        console.error("Update course DB error:", err);
        return res.status(500).json({ error: "Internal server error." });
      }
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Course not found or you do not have permission." });
      }
      return res.status(200).json({ message: "Course updated successfully." });
    });
  } catch (err) {
    return res.status(400).json({ error: err.toString() });
  }
};

const deleteCourse = (req, res) => {
  let quer, params;
  if (req.user.role === "admin") {
    quer = "DELETE FROM courses WHERE id = ?";
    params = [req.body.id];
  } else {
    quer = "DELETE FROM courses WHERE id = ? AND teacher_id = ?";
    params = [req.body.id, req.user.id];
  }

  db.query(quer, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error." });
    if (results.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Course not found or you do not have permission." });
    return res.status(200).json({ message: "Course deleted successfully." });
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getAllTeacherCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
