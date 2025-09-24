const express = require('express');
const router = express.Router();
const courseController = require('../controller/course.controller');
const limit = require('../middleware/limit.middleware');
const { roleAuth ,ROLE} = require('../middleware/auth.middleware');
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { courseCreateSchema, courseUpdateSchema, courseDeleteSchema, courseFindSchema, createTagSchema } = require('../validation/schemas');
// Allow both TEACHER and ADMIN to pass the middleware; controller enforces scope
router.post('/create',limit,auth, roleAuth([ROLE.TEACHER, ROLE.ADMIN]), validate(courseCreateSchema), courseController.createCourse);
router.post('/tag',auth, roleAuth([ROLE.ADMIN,ROLE.TEACHER]), validate(createTagSchema), courseController.createTag)
router.get('/all', courseController.getAllCourses);
// Both TEACHER and ADMIN can view; controller returns all when admin
router.get('/teacher/mycourses', auth, roleAuth([ROLE.TEACHER, ROLE.ADMIN]),courseController.getAllTeacherCourses);       
// Use path param for finding a course by id and validate params
router.get('/find/:id', auth, validate(courseFindSchema, 'params'), courseController.getCourseById);
router.get('/tags', courseController.getTags);
// Admin may update/delete any; controller has logic to check scope and return 404 if not found/owned
router.put('/update', auth, roleAuth([ROLE.TEACHER, ROLE.ADMIN]), validate(courseUpdateSchema), courseController.updateCourse);
router.delete('/delete', auth, roleAuth([ROLE.TEACHER, ROLE.ADMIN]), validate(courseDeleteSchema), courseController.deleteCourse);
module.exports = router;
