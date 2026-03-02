const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");

const createWavHeader = require("../utils/wavHeader");
const Consultation = require("../models/Consultation");


// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI,
//   file: () => ({
//     filename: `iot-${Date.now()}.wav`,
//     bucketName: "uploads"
//   })
// });

// const upload = multer({ storage });

// POST /api/iot/upload/:consultationId
// router.post("/upload/:consultationId", upload.single("file"), async (req, res) => {
//   try {
//     const { consultationId } = req.params;

//     const message = await Message.create({
//       consultationId,
//       senderRole: "patient",
//       messageType: "audio",
//       fileId: req.file.id
//     });

//     res.status(201).json({
//       message: "Audio uploaded successfully",
//       data: message
//     });

//   } catch (err) {
//     console.error("IoT upload error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


router.post(
  "/upload/:consultationId",
  express.raw({ type: "application/octet-stream", limit: "20mb" }),
  async (req, res) => {

    const wavHeader = createWavHeader(req.body.length);
    const wavBuffer = Buffer.concat([wavHeader, req.body]);


    try {
      const { consultationId } = req.params;

      const consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
      });

      const uploadStream = bucket.openUploadStream(
        `iot-${Date.now()}.wav`,
        { contentType: "audio/wav" }
      );


      uploadStream.end(wavBuffer);

      uploadStream.on("finish", async () => {

        const message = await Message.create({
          consultationId,
          senderId: consultation.patientId,     // 👈 important
          receiverId: consultation.doctorId,   // 👈 important
          senderRole: "patient",
          messageType: "audio",
          fileId: uploadStream.id
        });

        const io = req.app.get("io");
        if (io) io.to(consultationId.toString()).emit("new-message", message);

        res.status(201).json({
          message: "Audio uploaded successfully",
          data: message
        });
      });

    } catch (err) {
      console.error("IoT upload error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
