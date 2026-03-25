const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");

const createWavHeader = require("../utils/wavHeader");
const Consultation = require("../models/Consultation");
const IotChunk = require("../models/IotChunk");

// GET /api/iot/active-consultation/:patientId
router.get("/active-consultation/:patientId", async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      patientId: req.params.patientId,
      status: "active"
    }).sort({ createdAt: -1 });

    if (!consultation) {
      return res.status(404).json({ message: "No active consultation found for this patient." });
    }
    
    res.json({ consultationId: consultation._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/iot/upload/:consultationId
router.post(
  "/upload/:consultationId",
  express.raw({ type: "application/octet-stream", limit: "20mb" }),
  async (req, res) => {
    try {
      const { consultationId } = req.params;
      const chunkIndex = parseInt(req.query.index) || 0;

      await IotChunk.create({
        consultationId,
        data: req.body,
        chunkIndex
      });

      res.status(200).json({ message: "Chunk saved" });
    } catch (err) {
      console.error("IoT chunk upload error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// POST /api/iot/upload/:consultationId/finish
router.post("/upload/:consultationId/finish", async (req, res) => {
  try {
    const { consultationId } = req.params;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const chunks = await IotChunk.find({ consultationId }).sort({ chunkIndex: 1 });
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ message: "No chunks found for this consultation." });
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.data.length, 0);
    const wavHeader = createWavHeader(totalLength);
    
    const buffers = [wavHeader, ...chunks.map(c => c.data)];
    const finalBuffer = Buffer.concat(buffers);

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads"
    });

    const uploadStream = bucket.openUploadStream(
      `iot-${Date.now()}.wav`,
      { contentType: "audio/wav" }
    );

    uploadStream.end(finalBuffer);

    uploadStream.on("finish", async () => {
      const message = await Message.create({
        consultationId,
        senderId: consultation.patientId,
        receiverId: consultation.doctorId,
        senderRole: "patient",
        messageType: "audio",
        fileId: uploadStream.id
      });

      const io = req.app.get("io");
      if (io) io.to(consultationId.toString()).emit("new-message", message);

      // Clean up chunks
      await IotChunk.deleteMany({ consultationId });

      res.status(201).json({
        message: "Audio assembled and uploaded successfully",
        data: message
      });
    });

  } catch (err) {
    console.error("IoT finish error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
