const express = require('express');
const router = express.Router();
const courseController = require('../controller/course.controller');
const limit = require('../middleware/limit.middleware');
const { roleAuth ,ROLE} = require('../middleware/auth.middleware');
const { auth } = require('../middleware/auth.middleware');
router.post('/create',limit,auth, roleAuth(ROLE.TEACHER), courseController.createCourse);
router.post('/tag',auth, roleAuth([ROLE.ADMIN,ROLE.TEACHER]), courseController.createTag)
router.get('/all', courseController.getAllCourses);
router.get('/teacher/mycourses', auth, roleAuth(ROLE.TEACHER),courseController.getAllTeacherCourses);       
router.get('/find',auth, courseController.getCourseById);
router.get('/tags', courseController.getTags);
router.put('/update', auth, roleAuth(ROLE.TEACHER),courseController.updateCourse);
router.delete('/delete', auth, roleAuth(ROLE.TEACHER),courseController.deleteCourse);
module.exports = router;
