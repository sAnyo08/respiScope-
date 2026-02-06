const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const Message = require("../models/message");

exports.processAudioWithMatlab = async (req, res) => {
  try {
    const { messageId } = req.params;

    const rawMessage = await Message.findById(messageId);
    if (!rawMessage || rawMessage.messageType !== "audio") {
      return res.status(400).json({ message: "Invalid audio message" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // temp paths
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const rawPath = path.join(tempDir, `${messageId}_raw.wav`);
    const processedPath = path.join(tempDir, `${messageId}_processed.wav`);

    /* -------- 1️⃣ DOWNLOAD RAW AUDIO FROM GRIDFS -------- */
    await new Promise((resolve, reject) => {
      const downloadStream = bucket.openDownloadStream(rawMessage.fileId);
      const writeStream = fs.createWriteStream(rawPath);

      downloadStream.pipe(writeStream);
      writeStream.on("finish", resolve);
      downloadStream.on("error", reject);
    });

    /* -------- 2️⃣ RUN MATLAB SCRIPT -------- */
    await new Promise((resolve, reject) => {
      exec(
        `matlab -batch "process_audio"`,
        {
          env: {
            ...process.env,
            INPUT_AUDIO: rawPath,
            OUTPUT_AUDIO: processedPath,
          },
        },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    /* -------- 3️⃣ UPLOAD PROCESSED AUDIO TO GRIDFS -------- */
    const processedFileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(
        path.basename(processedPath),
        { contentType: "audio/wav" }
      );

      fs.createReadStream(processedPath)
        .pipe(uploadStream)
        .on("finish", () => resolve(uploadStream.id))
        .on("error", reject);
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

    /* -------- CLEANUP -------- */
    fs.unlinkSync(rawPath);
    fs.unlinkSync(processedPath);

    res.json({
      message: "Audio processed successfully",
      data: processedMessage,
    });
  } catch (err) {
    console.error("MATLAB processing error:", err);
    res.status(500).json({ error: "Audio processing failed" });
  }
};
