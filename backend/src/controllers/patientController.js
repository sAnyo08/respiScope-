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

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  getPatientProfile
}