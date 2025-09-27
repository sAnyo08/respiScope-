const express = require("express");
const { getPatients, getPatientById, createPatient } = require("../controllers/patientController.js");

const router = express.Router();

// GET all patients
router.get("/", getPatients);

// GET single patient by ID
router.get("/:id", getPatientById);

// POST create new patient
router.post("/", createPatient);

module.exports = router;
