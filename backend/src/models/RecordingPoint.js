const mongoose = require("mongoose");

const RecordingPointSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation", required: true },
  pointName: { type: String, required: true }, // mitral, aortic, left_lower_lung etc.
  sequence: { type: Number, required: true },  // order in guide
  duration: { type: Number, default: 8 },      // seconds
  audioUrl: { type: String },                  // Reference URL of the uploaded file
  fileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS ID for raw audio
  filteredFileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS ID for filtered audio
  rawFileName: { type: String },               // Original file name
  recordedAt: { type: Date, default: Date.now },
  aiAnalysis: {
    label: String,
    confidence: Number,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model("RecordingPoint", RecordingPointSchema);
