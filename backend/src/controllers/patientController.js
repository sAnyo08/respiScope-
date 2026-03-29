// import Patient from "../models/Patient.js";
const Patient = require("../models/Patient");

// GET all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("name age phone email");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create patient
const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const User = require("../models/User");
const Consultation = require("../models/Consultation");
const Message = require("../models/message");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

// ... existing code ...

const deletePatient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // 1. Find all consultations for this patient
    const consultations = await Consultation.find({ patientId });
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
    await Consultation.deleteMany({ patientId }).session(session);

    // 6. Delete Patient Profile
    await Patient.findByIdAndDelete(patientId).session(session);

    // 7. Delete User Account
    await User.findByIdAndDelete(patient.userId).session(session);

    await session.commitTransaction();
    res.json({ message: "Patient and all associated data deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Delete patient error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  getPatientProfile,
  deletePatient
}