// import Doctor from "../models/Doctor.js";
const Doctor = require("../models/Doctor");
// import Consultation from "../models/Consultation.js";
const Consultation = require("../models/Consultation");


// GET all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientsUnderDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId } = req.params;

    const consultations = await Consultation.find({
      doctorId,
      patientId,
    }).sort({ createdAt: -1 });

    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const User = require("../models/User");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

// ... existing code ...

const deleteDoctor = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // 1. Find all consultations for this doctor
    const consultations = await Consultation.find({ doctorId });
    const consultationIds = consultations.map(c => c._id);

    // 2. Find all messages with files in these consultations
    const messagesWithFiles = await Message.find({ 
      consultationId: { $in: consultationIds },
      fileId: { $exists: true } 
    });

    // 3. Delete files from GridFS
    for (const msg of messagesWithFiles) {
      try {
        await bucket.delete(msg.fileId);
      } catch (err) {
        console.error(`Failed to delete file ${msg.fileId}:`, err.message);
      }
    }

    // 4. Delete all messages
    await Message.deleteMany({ consultationId: { $in: consultationIds } }).session(session);

    // 5. Delete all consultations
    await Consultation.deleteMany({ doctorId }).session(session);

    // 6. Delete Doctor Profile
    await Doctor.findByIdAndDelete(doctorId).session(session);

    // 7. Delete User Account
    await User.findByIdAndDelete(doctor.userId).session(session);

    await session.commitTransaction();
    res.json({ message: "Doctor and all associated data deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Delete doctor error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  getDoctorProfile,
  getPatientsUnderDoctor,
  deleteDoctor
}