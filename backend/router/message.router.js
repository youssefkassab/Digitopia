const express = require('express');
const router = express.Router();
const messageController = require('../controller/message.controller');
const { messageLimiter } = require('../middleware/limit.middleware');
const { auth, roleAuth, ROLE } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { messageCreateSchema, messageUpdateSchema, messageSeenSchema, messageDeleteSchema } = require('../validation/schemas');

// Public send endpoint with stricter per-IP rate limit; remains unauthenticated by design
router.post('/send', messageLimiter, validate(messageCreateSchema), messageController.createMessage);
router.get('/receiveAll', auth, roleAuth(ROLE.ADMIN), messageController.getAllMessages);
router.get('/MyMessages', auth, messageController.getAllUserMessages);
router.patch('/update', auth, roleAuth([ROLE.USER, ROLE.TEACHER, ROLE.ADMIN]), validate(messageUpdateSchema), messageController.updateMessage);
router.patch('/seen', auth, roleAuth(ROLE.ADMIN), validate(messageSeenSchema), messageController.MarkAsSeen);
router.delete('/delete', auth, validate(messageDeleteSchema), messageController.deleteMessage);

module.exports = router;
