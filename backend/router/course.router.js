const express = require('express');
const router = express.Router();
const courseController = require('../controller/course.controller');
const limit = require('../middleware/limit.middleware');
const { roleAuth ,ROLE} = require('../middleware/auth.middleware');
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { courseCreateSchema, courseUpdateSchema, courseDeleteSchema, courseFindSchema, createTagSchema } = require('../validation/schemas');
router.post('/create',limit,auth, roleAuth(ROLE.TEACHER), validate(courseCreateSchema), courseController.createCourse);
router.post('/tag',auth, roleAuth([ROLE.ADMIN,ROLE.TEACHER]), validate(createTagSchema), courseController.createTag)
router.get('/all', courseController.getAllCourses);
router.get('/teacher/mycourses', auth, roleAuth(ROLE.TEACHER),courseController.getAllTeacherCourses);       
// Use path param for finding a course by id and validate params
router.get('/find/:id', auth, validate(courseFindSchema, 'params'), courseController.getCourseById);
router.get('/tags', courseController.getTags);
router.put('/update', auth, roleAuth(ROLE.TEACHER), validate(courseUpdateSchema), courseController.updateCourse);
router.delete('/delete', auth, roleAuth(ROLE.TEACHER), validate(courseDeleteSchema), courseController.deleteCourse);
module.exports = router;
