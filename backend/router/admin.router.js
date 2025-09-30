const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { idSchema } = require('../validation/schemas');

router.get('/students', auth, adminController.getStudents);
router.get('/teachers', auth, adminController.getTeachers);
router.get('/admins', auth, adminController.getAdmins);
router.delete('/students/:id', limit, auth, roleAuth(ROLE.ADMIN), validate(idSchema, 'params'), adminController.deleteStudent);
router.delete('/teachers/:id',limit, auth, roleAuth(ROLE.ADMIN), validate(idSchema, 'params'), adminController.deleteTeacher);

module.exports = router;