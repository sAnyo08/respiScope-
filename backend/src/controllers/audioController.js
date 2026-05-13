const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const Message = require("../models/message");
const createWavHeader = require("../utils/wavHeader");
const axios = require("axios");
const FormData = require("form-data");

/**
 * AI Analysis logic: Sends audio to Python and updates original message
 */
const analyzeAudioWithAI = async (messageId, io) => {
  try {
    // 1. Set status to pending immediately to update UI
    await Message.findByIdAndUpdate(messageId, { 
      "aiAnalysis.status": "pending" 
    });

    const message = await Message.findById(messageId);
    const targetFileId = message.filteredFileId || message.fileId;
    if (!targetFileId) return;

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStream(targetFileId);
    
    const chunks = [];
    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });
    const audioBuffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append("file", audioBuffer, {
      filename: `analysis_${messageId}.wav`,
      contentType: "audio/wav",
    });

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const aiResponse = await axios.post(`${aiServiceUrl}/analyze`, form, {
      headers: { ...form.getHeaders() },
    });

    const results = aiResponse.data;

    // 🚀 Update ORIGINAL message with AI insights
    const updatedMessage = await Message.findByIdAndUpdate(messageId, {
      aiAnalysis: {
        label: results.label,
        confidence: results.confidence,
        peaks: results.abnormal_peaks,
        spectrogram: results.spectrogram,
        status: "completed"
      }
    }, { new: true });

    if (io) {
      io.to(message.consultationId.toString()).emit("ai-analysis-complete", updatedMessage);
    }

    // 🚀 Store AI results into the Patient's history data
    const consultation = await mongoose.model("Consultation").findById(message.consultationId);
    if (consultation && consultation.patientId) {
      await mongoose.model("Patient").findByIdAndUpdate(consultation.patientId, {
        $push: { aiHistory: {
          diseaseLabel: results.label,
          confidence: results.confidence,
          consultationId: consultation._id
        }}
      });
    }

    return updatedMessage;
  } catch (err) {
    console.error("AI Analysis failed:", err.message);
    await Message.findByIdAndUpdate(messageId, { "aiAnalysis.status": "failed" });
  }
};

/**
 * Filter logic: Sends audio to Python, saves result to filteredFileId
 */
const processAudioWithNode = async (req, res) => {
  try {
    const { messageId } = req.params;

    const rawMessage = await Message.findById(messageId);
    if (!rawMessage || !rawMessage.fileId) {
      return res.status(400).json({ message: "Invalid audio message" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // 1. Download
    const downloadStream = bucket.openDownloadStream(rawMessage.fileId);
    const chunks = [];
    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });
    const rawBuffer = Buffer.concat(chunks);

    // 2. Call Python to Filter
    const form = new FormData();
    form.append("file", rawBuffer, {
      filename: `raw_${messageId}.webm`,
      contentType: "audio/webm",
    });

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const filterResponse = await axios.post(`${aiServiceUrl}/filter?filter_type=heart`, form, {
      headers: { ...form.getHeaders() },
      responseType: 'arraybuffer'
    });

    const filteredWavBuffer = Buffer.from(filterResponse.data);

    // 3. Upload Filtered Version
    const uploadStream = bucket.openUploadStream(
      `filtered_${Date.now()}.wav`,
      { contentType: "audio/wav" }
    );

    const filteredFileId = await new Promise((resolve, reject) => {
      uploadStream.end(filteredWavBuffer);
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    // 4. Update EXISTING message (don't create a new one)
    // 🚀 REMOVED aiAnalysis: {status: "pending"} here.
    const updatedMessage = await Message.findByIdAndUpdate(messageId, {
      filteredFileId: filteredFileId
    }, { new: true });

    // Notify doctor's UI that filter is ready
    const io = req.app.get("io");
    if (io) {
      io.to(rawMessage.consultationId.toString()).emit("ai-analysis-complete", updatedMessage);
    }

    res.json({
      message: "Audio filtered successfully. Click 'Run AI Analysis' to proceed.",
      data: updatedMessage,
    });
  } catch (err) {
    console.error("Audio processing error:", err.message);
    res.status(500).json({ error: "Audio processing failed: " + err.message });
  }
};

const processRecordingPoint = async (req, res) => {
  try {
    const { pointId } = req.params;
    const RecordingPoint = mongoose.model("RecordingPoint");
    const point = await RecordingPoint.findById(pointId);
    
    if (!point || !point.fileId) {
      return res.status(400).json({ message: "Invalid recording point or missing file" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // 1. Download
    const downloadStream = bucket.openDownloadStream(point.fileId);
    const chunks = [];
    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });
    const rawBuffer = Buffer.concat(chunks);

    // 2. Call Python to Filter
    const form = new FormData();
    form.append("file", rawBuffer, {
      filename: `raw_point_${pointId}.webm`,
      contentType: "audio/webm",
    });

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    // Decide filter type based on point name if needed, default to heart for now
    const filterType = point.pointName?.toLowerCase().includes('lung') ? 'lungs' : 'heart';
    
    const filterResponse = await axios.post(`${aiServiceUrl}/filter?filter_type=${filterType}`, form, {
      headers: { ...form.getHeaders() },
      responseType: 'arraybuffer'
    });

    const filteredWavBuffer = Buffer.from(filterResponse.data);

    // 3. Upload Filtered Version
    const uploadStream = bucket.openUploadStream(
      `filtered_point_${Date.now()}.wav`,
      { contentType: "audio/wav" }
    );

    const filteredFileId = await new Promise((resolve, reject) => {
      uploadStream.end(filteredWavBuffer);
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    // 4. Update point
    const updatedPoint = await RecordingPoint.findByIdAndUpdate(pointId, {
      filteredFileId: filteredFileId
    }, { new: true });

    res.json({
      message: "Audio filtered successfully.",
      data: updatedPoint,
    });
  } catch (err) {
    console.error("Recording point processing error:", err.message);
    res.status(500).json({ error: "Processing failed: " + err.message });
  }
};

const analyzeRecordingPointWithAI = async (req, res) => {
  try {
    const { pointId } = req.params;
    const RecordingPoint = mongoose.model("RecordingPoint");
    
    await RecordingPoint.findByIdAndUpdate(pointId, { "aiAnalysis.status": "pending" });

    const point = await RecordingPoint.findById(pointId);
    const targetFileId = point.filteredFileId || point.fileId;
    
    if (!targetFileId) {
      return res.status(400).json({ message: "No audio file to analyze" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStream(targetFileId);
    
    const chunks = [];
    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });
    const audioBuffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append("file", audioBuffer, {
      filename: `analysis_point_${pointId}.wav`,
      contentType: "audio/wav",
    });

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const aiResponse = await axios.post(`${aiServiceUrl}/analyze`, form, {
      headers: { ...form.getHeaders() },
    });

    const results = aiResponse.data;

    const updatedPoint = await RecordingPoint.findByIdAndUpdate(pointId, {
      aiAnalysis: {
        label: results.label,
        confidence: results.confidence,
        status: "completed"
      }
    }, { new: true });

    res.json({ message: "AI Analysis complete", data: updatedPoint });
  } catch (err) {
    console.error("Recording point AI Analysis failed:", err.message);
    res.status(500).json({ error: "AI Analysis failed" });
  }
};

module.exports = {
  processAudioWithMatlab: processAudioWithNode,
  analyzeAudioWithAI,
  processRecordingPoint,
  analyzeRecordingPointWithAI
}
