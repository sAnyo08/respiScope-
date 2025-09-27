const express = require("express");
const { getDoctors, getDoctorById, createDoctor } = require("../controllers/doctorController.js");

const router = express.Router();

// GET all doctors
router.get("/", getDoctors);

// GET single doctor by ID
router.get("/:id", getDoctorById);

// POST create new doctor
router.post("/", createDoctor);

module.exports = router;
