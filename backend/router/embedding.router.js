const express = require("express");
const { addEmbeddings } = require("../controller/embed.controller");

const router = express.Router();

router.post("/", addEmbeddings);

module.exports = router;
