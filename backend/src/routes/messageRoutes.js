const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware")
const {
  sendTextMessage,
  sendFileMessage,
  getMessages,
  getConsultationMessages,
  getFile,
  getConsultationAudioMessages,
  deleteMessage,
} = require("../controllers/messageController");

// Text message
router.post("/text",auth(), sendTextMessage);

// File/audio message
router.post("/file",auth(), upload.single("file"), sendFileMessage);

// Get all messages of a consultation
//router.get("/:consultationId", getConsultationMessages);

// Get all messages for a consultation (CHAT HISTORY)
router.get(
  "/consultation/:consultationId",
  auth(),
  getConsultationMessages
);

// Get all messages of a user patient
// router.get("/:userId", getMessages);

// Stream file/audio by fileId (Authenticated)
router.get("/file/:id", auth(), getFile);

// Public stream (for <audio> tags and downloads)
router.get("/file/public/:id", getFile);

router.get(
  "/consultation/:id/audio",
  auth("doctor"),
  getConsultationAudioMessages
);

// Delete message
router.delete("/:id", auth(), deleteMessage);

module.exports = router;
