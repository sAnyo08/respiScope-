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

// POST /api/audio/ai-analyze/:messageId
router.post(
  "/ai-analyze/:messageId",
  auth("doctor"),
  async (req, res) => {
    try {
      const results = await audioController.analyzeAudioWithAI(req.params.messageId);
      res.json({ message: "AI Analysis triggered", results });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
