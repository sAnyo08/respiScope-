const Consultation = require("../models/Consultation");
const RecordingPoint = require("../models/RecordingPoint");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

// Create or fetch a consultation
exports.startConsultation = async (req, res) => {
  try {
    const { doctorId, type } = req.body;
    const patientId = req.user._id;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Check for an existing recording session of the same type that is not completed
    let consultation = await Consultation.findOne({
      doctorId,
      patientId,
      type: type || "heart",
      status: { $in: ["pending", "active", "recording"] },
    });

    if (!consultation) {
      consultation = new Consultation({
        doctorId,
        patientId,
        type: type || "heart",
        status: "recording",
        startedAt: new Date()
      });
      await consultation.save();
    }

    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a recording point to a consultation
exports.addRecordingPoint = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { pointName, sequence, duration, audioUrl, rawFileName } = req.body;

    const recordingPoint = new RecordingPoint({
      consultationId,
      pointName,
      sequence,
      duration,
      audioUrl,
      rawFileName,
      recordedAt: new Date()
    });

    await recordingPoint.save();

    res.status(201).json(recordingPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete a consultation session
exports.completeConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { notes } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      consultationId,
      { 
        status: "submitted",
        completedAt: new Date(),
        notes: notes || ""
      },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.status(200).json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get consultations for logged-in patient
exports.getPatientConsultations = async (req, res) => {
  try {
    const patientId = req.user._id;
    const consultations = await Consultation.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get consultations for logged-in doctor
exports.getDoctorConsultations = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const consultations = await Consultation.find({ doctorId })
      .populate("patientId", "name age")
      .sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single consultation details including recording points
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate("doctorId", "name phone specialization")
      .populate("patientId", "name phone age");

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const recordingPoints = await RecordingPoint.find({ consultationId: consultation._id })
      .sort({ sequence: 1 });

    res.status(200).json({
      ...consultation.toObject(),
      recordingPoints
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete consultation
exports.deleteConsultation = async (req, res) => {
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

    const pointsWithFiles = await RecordingPoint.find({
      consultationId,
      $or: [
        { fileId: { $exists: true } },
        { filteredFileId: { $exists: true } }
      ]
    });

    for (const msg of messagesWithFiles) {
      try {
        if (msg.fileId) await bucket.delete(msg.fileId);
      } catch (err) {
        console.error(`Failed to delete message file ${msg.fileId}:`, err.message);
      }
    }

    for (const point of pointsWithFiles) {
      try {
        if (point.fileId) await bucket.delete(point.fileId);
        if (point.filteredFileId) await bucket.delete(point.filteredFileId);
      } catch (err) {
        console.error(`Failed to delete point files for ${point._id}:`, err.message);
      }
    }

    await Message.deleteMany({ consultationId }).session(session);
    await RecordingPoint.deleteMany({ consultationId }).session(session);
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
};

// Get all consultations for a specific patient (for the logged-in doctor)
exports.getPatientConsultationsForDoctor = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;
    
    const consultations = await Consultation.find({ patientId, doctorId })
      .sort({ createdAt: -1 });
      
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get participant info for a consultation
exports.getParticipantInfo = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const userId = req.userId.toString();
    const userRole = req.role;

    let targetId;
    let targetModel;

    if (userRole === "patient") {
      targetId = consultation.doctorId;
      targetModel = "Doctor";
    } else {
      targetId = consultation.patientId;
      targetModel = "Patient";
    }

    const participant = await mongoose.model(targetModel).findById(targetId);

    if (!participant) {
      return res.status(404).json({ message: "Participant profile not found" });
    }

    res.status(200).json(participant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
