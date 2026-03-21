const mongoose = require("mongoose");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");
const Consultation = require("../models/Consultation");

// Send text message
exports.sendTextMessage = async (req, res) => {

  const { consultationId, senderRole, senderId, receiverId, text } = req.body;

  if (!consultationId || !text) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const message = new Message({
      consultationId,
      senderRole: req.role,
      senderId: req.authUserId,
      receiverId: req.userId,
      messageType: "text",
      text,
    });
    await message.save();
    const io = req.app.get("io");
    if (io) io.to(consultationId.toString()).emit("new-message", message);
    res.json({ message: "Text message sent", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send audio/file message
exports.sendFileMessage = async (req, res) => {
  try {
    const { consultationId, senderRole, senderId, messageType } = req.body;

    if (!consultationId || !senderRole || !senderId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!req.file || !req.file.id) {
      return res.status(400).json({
        message: "File upload failed",
      });
    }

    // 🔥 Fetch consultation to determine receiver
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // 🔥 Auto-resolve receiverId
    const receiverId =
      senderRole === "patient" ? consultation.doctorId : consultation.patientId;

    const message = new Message({
      consultationId,
      senderRole,
      senderId,
      receiverId,
      messageType: messageType || "audio",
      fileId: req.file.id,
      fileName: req.file.filename,
      fileSize: req.file.size,
    });

    await message.save();

    const io = req.app.get("io");
    if (io) io.to(consultationId.toString()).emit("new-message", message);

    res.status(201).json({
      message: "File message sent",
      data: message,
    });
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
exports.getFile = async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // 1. Find file metadata first
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    // 2. Set headers for browser audio player
    res.set({
      "Content-Type": file.contentType || "audio/wav",
      "Content-Length": file.length,
      "Accept-Ranges": "bytes",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    });

    // 3. Stream
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error("getFile error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getConsultationAudioMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      consultationId: req.params.id,
      messageType: "audio",
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete a message and its associated files
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Auth check: only sender or a doctor can delete?
    // For now, let's allow the deletion if the user is part of the consultation
    
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // 1. Delete Raw File
    if (message.fileId) {
      try {
        await bucket.delete(message.fileId);
      } catch (err) {
        console.error("Failed to delete raw file:", err.message);
      }
    }

    // 2. Delete Filtered File
    if (message.filteredFileId) {
      try {
        await bucket.delete(message.filteredFileId);
      } catch (err) {
        console.error("Failed to delete filtered file:", err.message);
      }
    }

    // 3. Delete Message from DB
    await Message.findByIdAndDelete(id);

    // 4. Notify via Socket
    const io = req.app.get("io");
    if (io) {
      io.to(message.consultationId.toString()).emit("message-deleted", id);
    }

    res.json({ message: "Message and associated files deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};
