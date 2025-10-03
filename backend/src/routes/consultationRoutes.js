const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const authMiddleware = require("../middleware/authMiddleware");

// Create or fetch a consultation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user._id; // From JWT payload

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

module.exports = router;