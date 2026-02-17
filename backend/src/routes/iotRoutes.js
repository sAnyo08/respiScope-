const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Message = require("../models/Message");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: () => ({
    filename: `iot-${Date.now()}.wav`,
    bucketName: "uploads"
  })
});

const upload = multer({ storage });

// POST /api/iot/upload/:consultationId
router.post("/upload/:consultationId", upload.single("file"), async (req, res) => {
  try {
    const { consultationId } = req.params;

    const message = await Message.create({
      consultationId,
      senderRole: "patient",
      messageType: "audio",
      fileId: req.file.id
    });

    res.status(201).json({
      message: "Audio uploaded successfully",
      data: message
    });

  } catch (err) {
    console.error("IoT upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
