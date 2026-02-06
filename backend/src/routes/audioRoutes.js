const express = require("express");
const router = express.Router();
const audioController = require("../controllers/audioController");
const auth = require("../middleware/authMiddleware"); // your JWT middleware

// POST /api/audio/process/:messageId
router.post(
  "/process/:messageId",
  auth("doctor"), // Only doctors can process audio
  audioController.processAudioWithMatlab
);

module.exports = router;
