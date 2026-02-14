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

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  getDoctorProfile,
  getPatientsUnderDoctor
}