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
router.get('/grade/:id', auth, userController.getGrade);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

const { Chat } = require("../db/models");

// ✅ Get all chats for current user
router.get("/userChats", auth, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { userId: req.user.id },
      order: [["sentAt", "DESC"]],
    });

    // Group messages by chatId
    const chatMap = {};
    chats.forEach((msg) => {
      if (!chatMap[msg.chatId]) {
        chatMap[msg.chatId] = { id: msg.chatId, name: msg.title || "New Chat", messages: [] };
      }
      chatMap[msg.chatId].messages.push({ sender: msg.role === "user" ? "user" : "ai", text: msg.text });
    });

    const chatList = Object.values(chatMap);
    res.status(200).json(chatList);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create a new chat
router.post("/", auth, async (req, res) => {
  try {
    const { chatId, title } = req.body;
    if (!chatId) return res.status(400).json({ error: "chatId is required" });

    // Create a placeholder chat with no messages yet
    await Chat.create({
      chatId,
      userId: req.user.id,
      text: "",
      role: "user",
      title: title || "New Chat",
    });

    res.status(201).json({ message: "Chat created", chatId });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a chat by chatId
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.destroy({ where: { chatId: id, userId: req.user.id } });
    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
