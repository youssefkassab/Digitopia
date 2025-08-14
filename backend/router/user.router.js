const express = require('express');
const router = express.Router();
const userController = require('../controller/user.Controller');
const limit = require('../middleware/limit.middleware');


router.post('/login',limit, userController.login);
router.post('/signup',limit, userController.signup);
router.post('/logout', userController.logout);
router.get('/user', userController.user);
module.exports = router;
