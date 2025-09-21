const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');

router.post('/login', limit, userController.login);
router.post('/signup', limit, userController.signup);
router.post('/logout', auth,userController.logout);
router.get('/user', auth, userController.user);
router.post('/upgradeRole', auth, roleAuth(ROLE.ADMIN), userController.upgradeRole);

module.exports = router;
