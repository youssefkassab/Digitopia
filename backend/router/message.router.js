const express = require('express');
const router = express.Router();
const messageController = require('../controller/message.controller');
const limit = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');

router.post('/send', limit, messageController.createMessage);
router.get('/receiveAll', auth, roleAuth(ROLE.ADMIN), messageController.getAllMessages);
router.get('/MyMessages', auth, messageController.getAllUserMessages);
router.patch('/update', auth, roleAuth([ROLE.USER, ROLE.TEACHER]), messageController.updateMessage);
router.patch('/seen', auth, roleAuth(ROLE.ADMIN), messageController.MarkAsSeen);
router.delete('/delete', auth, messageController.deleteMessage);

module.exports = router;
