const express = require("express");
const router = express.Router();
const courseController = require("../controller/course.Controller");
const limit = require("../middleware/limit.middleware");
const { roleAuth, ROLE, auth } = require("../middleware/auth.middleware");
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/courses/"); // Save in uploads/courses
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create course with optional video upload
router.post(
  "/create",
  limit,
  auth,
  roleAuth(ROLE.TEACHER),
  upload.single("video"), // 👈 Add multer middleware
  courseController.createCourse
);

router.get("/all", courseController.getAllCourses);
router.get(
  "/teacher/mycourses",
  auth,
  roleAuth(ROLE.TEACHER),
  courseController.getAllTeacherCourses
);
router.get("/find", auth, courseController.getCourseById);
router.put(
  "/update",
  auth,
  roleAuth(ROLE.TEACHER),
  courseController.updateCourse
);
router.delete(
  "/delete",
  auth,
  roleAuth(ROLE.TEACHER),
  courseController.deleteCourse
);

module.exports = router;
