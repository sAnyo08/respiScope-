// models/message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation", required: true },
  senderRole: { type: String, enum: ["doctor", "patient"], required: true },
  messageType: { type: String, enum: ["text", "audio", "file"], required: true },
  text: { type: String },
  fileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS File ID
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
