const mongoose = require("mongoose");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");

// Send text message
exports.sendTextMessage = async (req, res) => {
  const { consultationId, senderRole, senderId, receiverId, text } = req.body;
  try {
    const message = new Message({
      consultationId,
      senderRole,
      senderId,
      receiverId,
      messageType: "text",
      text,
    });
    await message.save();
    res.json({ message: "Text message sent", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send audio/file message
exports.sendFileMessage = async (req, res) => {
  try {
    const { consultationId, messageType } = req.body;

    if (!consultationId) {
      return res.status(400).json({ error: "consultationId is required" });
    }

    // 🔑 get logged-in user from auth middleware
    const senderId = req.user._id;
    const senderRole = req.role;

    // 🔑 fetch consultation
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // 🔑 determine receiver
    const receiverId =
      senderRole === "patient"
        ? consultation.doctorId
        : consultation.patientId;

    const message = new Message({
      consultationId,
      senderRole,
      senderId,
      receiverId,
      messageType, // "audio" | "file"
      fileId: req.file.id,
    });

    await message.save();

    res.json({ message: "File message sent", data: message });
  } catch (err) {
    console.error("File message error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all messages in a consultation
// exports.getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({
//       userId: req.params.userId,
//     }).sort("createdAt");
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Fetch all messages in a consultation
exports.getConsultationMessages = async (req, res) => {

  try {
    const { consultationId } = req.params;

    const messages = await Message.find({ consultationId }).sort({
      createdAt: 1,
    }); // oldest → newest

    res.status(200).json({
      consultationId,
      totalMessages: messages.length,
      messages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stream a file from GridFS
exports.getFile = (req, res) => {
  try {
    const gfs = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
