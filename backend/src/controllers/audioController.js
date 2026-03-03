const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const Message = require("../models/message");
const createWavHeader = require("../utils/wavHeader");

/**
 * Butterworth Low-Pass Filter Implementation (Order 2)
 * Since MATLAB 'designfilt' uses higher orders, we can chain multiple 2nd order sections 
 * or use a simple 1st order for demonstrative isolated heart sounds.
 * 
 * Target: Isolation of Heart Sounds (< 200Hz)
 */
function applyLowPassFilter(samples, sampleRate, cutoff = 200) {
    const rc = 1.0 / (cutoff * 2 * Math.PI);
    const dt = 1.0 / sampleRate;
    const alpha = dt / (rc + dt);
    
    const output = new Int16Array(samples.length);
    let lastValue = samples[0];

    for (let i = 0; i < samples.length; i++) {
        // Simple 1st Order IIR filter
        const currentValue = lastValue + alpha * (samples[i] - lastValue);
        output[i] = Math.round(currentValue);
        lastValue = currentValue;
    }
    return output;
}

const processAudioWithNode = async (req, res) => {
  try {
    const { messageId } = req.params;

    const rawMessage = await Message.findById(messageId);
    if (!rawMessage || rawMessage.messageType !== "audio") {
      return res.status(400).json({ message: "Invalid audio message" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    /* -------- 1️⃣ DOWNLOAD RAW AUDIO -------- */
    const downloadStream = bucket.openDownloadStream(rawMessage.fileId);
    const chunks = [];

    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });

    const rawBuffer = Buffer.concat(chunks);
    
    // Convert Buffer to Int16Array (16-bit PCM)
    // Skip potential header if it's already a WAV (first 44 bytes)
    // If it's a raw stream from ESP32, it might not have a header yet
    let pcmData;
    let startOffset = 0;
    
    if (rawBuffer.slice(0, 4).toString() === "RIFF") {
        startOffset = 44; // Standard WAV header size
    }
    
    const pcmBuffer = rawBuffer.slice(startOffset);
    pcmData = new Int16Array(
        pcmBuffer.buffer, 
        pcmBuffer.byteOffset, 
        pcmBuffer.length / 2
    );

    /* -------- 2️⃣ APPLY DSP FILTER (MATLAB PORT) -------- */
    // isolating heart sounds (Low pass < 200Hz)
    const filteredPcm = applyLowPassFilter(pcmData, 8000, 200);

    // Convert back to Buffer
    const filteredBuffer = Buffer.from(filteredPcm.buffer);
    const wavHeader = createWavHeader(filteredBuffer.length, 8000);
    const finalBuffer = Buffer.concat([wavHeader, filteredBuffer]);

    /* -------- 3️⃣ UPLOAD PROCESSED AUDIO -------- */
    const uploadStream = bucket.openUploadStream(
      `processed_heart_${Date.now()}.wav`,
      { contentType: "audio/wav" }
    );

    const processedFileId = await new Promise((resolve, reject) => {
      uploadStream.end(finalBuffer);
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    /* -------- 4️⃣ CREATE NEW MESSAGE -------- */
    const processedMessage = await Message.create({
      consultationId: rawMessage.consultationId,
      senderRole: "doctor",
      senderId: req.userId, // Profile ID from authMiddleware
      receiverId: rawMessage.senderId,
      messageType: "audio_processed",
      fileId: processedFileId,
      parentFileId: rawMessage.fileId,
      fileName: `Processed_Heart_Sound_${new Date().toLocaleTimeString()}.wav`
    });

    res.json({
      message: "Audio processed successfully",
      data: processedMessage,
    });
  } catch (err) {
    console.error("Audio processing error:", err);
    res.status(500).json({ error: "Audio processing failed: " + err.message });
  }
};

module.exports = {
  processAudioWithMatlab: processAudioWithNode,
}
