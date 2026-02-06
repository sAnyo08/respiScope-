import Doctor from "../models/Doctor.js";
import Consultation from "../models/Consultation.js";

// GET all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single doctor
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create doctor
export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getDoctorProfile = async (req, res) => {
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

export const getPatientsUnderDoctor = async (req, res) => {
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