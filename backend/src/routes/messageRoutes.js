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

// Stream file/audio by fileId
router.get("/file/:id",auth(), getFile);

router.get(
  "/consultation/:id/audio",
  auth("doctor"),
  getConsultationAudioMessages
);

module.exports = router;
