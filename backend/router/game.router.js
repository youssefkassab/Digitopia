const express = require('express');
const router = express.Router();
const gameController = require('../controller/game.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { userLoginSchema, userSignupSchema, userUpgradeRoleSchema } = require('../validation/schemas');
const { uploaderMiddleware } = require('../middleware/uploader.middleware');

router.get('/all', gameController.getAll);
router.post('/add', auth, roleAuth(ROLE.ADMIN), uploaderMiddleware, gameController.add);
router.delete('/delete', auth, roleAuth(ROLE.ADMIN), gameController.deletegame);
router.patch('/update', auth, roleAuth(ROLE.ADMIN), uploaderMiddleware, gameController.update);

module.exports = router;
