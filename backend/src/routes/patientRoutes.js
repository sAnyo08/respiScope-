const express = require("express");
const { getPatients, getPatientById, createPatient, getPatientProfile, deletePatient } = require("../controllers/patientController.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

// 🔥 GET logged-in patient profile
router.get("/profile", auth("patient"), getPatientProfile);

// GET all patients
router.get("/", getPatients);

// GET single patient by ID
router.get("/:id", getPatientById);

// POST create new patient
router.post("/", createPatient);

// DELETE patient
router.delete("/:id", auth("patient"), deletePatient);

module.exports = router;
