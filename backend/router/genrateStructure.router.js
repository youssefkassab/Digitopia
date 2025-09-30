const express = require("express");
const { generateStructure } = require("../controller/structure.controller");

const router = express.Router();

router.post("/", async (req, res) => {
  const replace = req.body?.replace === "true";
  console.log("Request Body:", req.body);

  try {
    await generateStructure(replace);
    res.json({ success: true, message: "Structure generated successfully" });
  } catch (err) {
    console.error("Error generating structure:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
