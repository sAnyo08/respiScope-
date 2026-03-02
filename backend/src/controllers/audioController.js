const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const Message = require("../models/message");
const createWavHeader = require("../utils/wavHeader");
const { Stream } = require("stream");

const processAudioWithNode = async (req, res) => {
  try {
    const { messageId } = req.params;

    const rawMessage = await Message.findById(messageId);
    if (!rawMessage || rawMessage.messageType !== "audio") {
      return res.status(400).json({ message: "Invalid audio message" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    /* -------- 1️⃣ DOWNLOAD RAW AUDIO FROM GRIDFS -------- */
    const downloadStream = bucket.openDownloadStream(rawMessage.fileId);
    const chunks = [];

    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });

    const rawBuffer = Buffer.concat(chunks);

    /* -------- 2️⃣ PROCESS AUDIO: PREPEND WAV HEADER -------- */
    // The ESP32 stream seems to be raw PCM. Generating a matching WAV header.
    // Assuming 8000 Hz, 1 channel, 16 bits per sample (standard defaults in wavHeader.js)
    const wavHeader = createWavHeader(rawBuffer.length);
    const processedBuffer = Buffer.concat([wavHeader, rawBuffer]);

    /* -------- 3️⃣ UPLOAD PROCESSED AUDIO TO GRIDFS -------- */
    const uploadStream = bucket.openUploadStream(
      `${messageId}_processed.wav`,
      { contentType: "audio/wav" }
    );

    const processedFileId = await new Promise((resolve, reject) => {
      uploadStream.end(processedBuffer);
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    /* -------- 4️⃣ CREATE NEW MESSAGE -------- */
    const processedMessage = new Message({
      consultationId: rawMessage.consultationId,
      senderRole: "doctor",
      senderId: req.user.id,
      receiverId: rawMessage.senderId,
      messageType: "audio_processed",
      fileId: processedFileId,
      parentFileId: rawMessage.fileId,
    });

    await processedMessage.save();

    res.json({
      message: "Audio processed successfully",
      data: processedMessage,
    });
  } catch (err) {
    console.error("Audio processing error:", err);
    res.status(500).json({ error: "Audio processing failed" });
  }
};

module.exports = {
  processAudioWithMatlab: processAudioWithNode, // Keep exported name for route compatibility, or change route
}