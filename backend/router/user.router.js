const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { userLoginSchema, userSignupSchema, userUpgradeRoleSchema } = require('../validation/schemas');

router.post('/login', limit, validate(userLoginSchema), userController.login);
router.post('/signup', limit, validate(userSignupSchema), userController.signup);
router.post('/logout', auth,userController.logout);
router.get('/user', auth, userController.user);
router.post('/upgradeRole', auth, roleAuth(ROLE.ADMIN), validate(userUpgradeRoleSchema), userController.upgradeRole);

module.exports = router;
