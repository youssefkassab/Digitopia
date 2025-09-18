// backend/router/message.router.js
const express = require("express");
const router = express.Router();
const MessageController = require("../controller/message.Controller");
const { auth, roleAuth, ROLE } = require("../middleware/auth.middleware");

// === User Side ===
router.post("/send", MessageController.createMessage);
router.get("/my", auth, MessageController.getAllUserMessages);

// === Admin Side ===
router.get(
  "/all",
  auth,
  roleAuth(ROLE.ADMIN),
  MessageController.getAllMessages
);
router.post(
  "/reply/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  MessageController.replyToMessage
);
router.patch(
  "/seen/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  MessageController.MarkAsSeen
);
router.delete(
  "/:id",
  auth,
  roleAuth(ROLE.ADMIN),
  MessageController.deleteMessage
);

module.exports = router;
