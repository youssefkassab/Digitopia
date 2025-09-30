const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { courseDeleteSchema } = require('../validation/schemas');

router.get('/students', auth, adminController.getStudents);
router.get('/teachers', auth, adminController.getTeachers);
router.get('/admins', auth, adminController.getAdmins);
router.delete('/delete', limit, auth, roleAuth(ROLE.ADMIN), validate(courseDeleteSchema), adminController.deleteUser);

module.exports = router;