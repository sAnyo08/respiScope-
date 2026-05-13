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
      const io = req.app.get("io");
      const results = await audioController.analyzeAudioWithAI(req.params.messageId, io);
      res.json({ message: "AI Analysis triggered", results });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/audio/process-point/:pointId
router.post(
  "/process-point/:pointId",
  auth("doctor"),
  audioController.processRecordingPoint
);

// POST /api/audio/ai-analyze-point/:pointId
router.post(
  "/ai-analyze-point/:pointId",
  auth("doctor"),
  audioController.analyzeRecordingPointWithAI
);

module.exports = router;
