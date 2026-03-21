const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const auth = require("../middleware/authMiddleware");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const getPatientsUnderDoctor = require("../controllers/doctorController.js").getPatientsUnderDoctor;

// Create or fetch a consultation
router.post("/", auth("patient"), async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user._id;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
    
    let consultation = await Consultation.findOne({
      doctorId,
      patientId,
      status: { $in: ["pending", "active"] },
    });

    if (!consultation) {
      consultation = new Consultation({
        doctorId,
        patientId,
        status: "pending",
      });
      await consultation.save();
    }

    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consultations for logged-in patient
router.get("/patient", auth("patient"), async (req, res) => {
  try {
    const patientId = req.user._id;
    const consultations = await Consultation.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consultations for logged-in doctor
router.get("/doctor", auth("doctor"), async (req, res) => {
  try {
    const doctorId = req.user._id;
    const consultations = await Consultation.find({ doctorId })
      .populate("patientId", "name age")
      .sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific patient's history for a doctor
router.get("/doctor/patient/:patientId", auth("doctor"), getPatientsUnderDoctor);

// Get single consultation by ID
router.get("/:consultationId", auth(), async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:consultationId/participant", auth(), async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate("doctorId", "name phone specialization")
      .populate("patientId", "name phone age");

    if (!consultation) return res.status(404).json({ message: "Not found" });

    const other = req.role === "patient" ? consultation.doctorId : consultation.patientId;
    res.json(other);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE consultation
router.delete("/:consultationId", auth(), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const profileId = req.userId.toString();
    if (consultation.doctorId.toString() !== profileId && consultation.patientId.toString() !== profileId) {
      return res.status(403).json({ message: "Forbidden: Not a participant" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const messagesWithFiles = await Message.find({ 
      consultationId,
      fileId: { $exists: true } 
    });

    for (const msg of messagesWithFiles) {
      try {
        await bucket.delete(msg.fileId);
      } catch (err) {
        console.error(`Failed to delete file ${msg.fileId}:`, err.message);
      }
    }

    await Message.deleteMany({ consultationId }).session(session);
    await Consultation.findByIdAndDelete(consultationId).session(session);

    await session.commitTransaction();
    res.json({ message: "Consultation and associated data deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Delete consultation error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
