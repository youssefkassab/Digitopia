// backend/router/admin.router.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { auth, roleAuth, ROLE } = require("../middleware/auth.middleware");

// === Admin Authentication Routes ===
router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);

// === Student Management Routes (Admin only) ===
router.get(
  "/students",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.getStudents
);
router.post(
  "/students",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.addStudent
);
router.delete(
  "/students/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.deleteStudent
);

// === Teacher Management Routes (Admin only) ===
router.get(
  "/teachers",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.getTeachers
);
router.post(
  "/teachers",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.addTeacher
);
router.delete(
  "/teachers/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.deleteTeacher
);

// === Admin Management Routes (Admin only) ===
router.get("/admins", auth, roleAuth(ROLE.ADMIN), adminController.getAdmins);

router.delete(
  "/admins/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  adminController.deleteAdmin
);

module.exports = router;
