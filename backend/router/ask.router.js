const express = require("express");
const { ask } = require("../controller/ask.controller");

const router = express.Router();
router.post("/", ask);

module.exports = router;
