const express = require("express");
const { uploadJsonData } = require("../controller/upload.controller");

const router = express.Router();

router.post("/", async (req, res) => {
  // const { grade, subject, term, replace } = req.body;
  const { grade, subject, term, replace } = req.body || {};
  const file = req.files?.file;

  if (!grade || !subject || !term || !file) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: grade, subject, term, or file",
    });
  }

  try {
    const fileData = file.data.toString("utf8");
    await uploadJsonData(grade, subject, term, fileData, replace === "true");

    res.json({ success: true, message: "Data uploaded successfully" });
  } catch (err) {
    console.error("Error in upload route:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
