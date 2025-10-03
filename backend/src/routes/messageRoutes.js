const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  sendTextMessage,
  sendFileMessage,
  getMessages,
  getFile,
} = require("../controllers/messageController");

// Text message
router.post("/text", sendTextMessage);

// File/audio message
router.post("/file", upload.single("file"), sendFileMessage);

// Get all messages of a consultation
router.get("/:consultationId", getMessages);

// Stream file/audio by fileId
router.get("/file/:id", getFile);

module.exports = router;
