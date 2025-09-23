const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const limit = require('../middleware/limit.middleware');
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { idSchema } = require('../validation/schemas');

router.get('/students', auth, adminController.getStudents);
router.get('/teachers', auth, adminController.getTeachers);
router.get('/admins', auth, adminController.getAdmins);
router.delete('/students/:id', auth, validate(idSchema, 'params'), adminController.deleteStudent);
router.delete('/teachers/:id', auth, validate(idSchema, 'params'), adminController.deleteTeacher);

module.exports = router;