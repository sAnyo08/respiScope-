const express = require("express");
const { getDoctors, getDoctorById, createDoctor, getDoctorProfile, getPatientsUnderDoctor, deleteDoctor } = require("../controllers/doctorController.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/profile", auth("doctor"), getDoctorProfile);

// GET all doctors
router.get("/", getDoctors);

// GET single doctor by ID
router.get("/:id", getDoctorById);

router.get("/patient/:patientId", auth("doctor"), getPatientsUnderDoctor);

// POST create new doctor
router.post("/", createDoctor);

// DELETE doctor
router.delete("/:id", auth("doctor"), deleteDoctor);

module.exports = router;
