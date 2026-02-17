// models/message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation", required: true },
  senderRole: { type: String, enum: ["doctor", "patient"], required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Add this
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Add this
  messageType: { type: String, enum: ["text", "audio","audio_processed", "file"], required: true },
  text: { type: String },
  fileId: { type: mongoose.Schema.Types.ObjectId },// GridFS File ID
  parentFileId: {type: mongoose.Schema.Types.ObjectId}, //raw audio reference
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = Message;
