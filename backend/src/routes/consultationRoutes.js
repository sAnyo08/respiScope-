const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const auth = require("../middleware/authMiddleware");

// Create or fetch a consultation
router.post("/", auth("patient"), async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user._id; // From JWT payload


    // Validate doctorId exists
    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
    
    // Check if doctor exists
    // const doctor = await Doctor.findById(doctorId);
    // if (!doctor) {
    //   return res.status(404).json({ message: "Doctor not found" });
    // }

    // Check if a consultation already exists
    let consultation = await Consultation.findOne({
      doctorId,
      patientId,
      status: { $in: ["pending", "active"] },
    });

    if (!consultation) {
      // Create new consultation
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


module.exports = router;