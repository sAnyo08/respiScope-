const express = require("express");
const { getDoctors, getDoctorById, createDoctor, getDoctorProfile } = require("../controllers/doctorController.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/profile", auth("doctor"), getDoctorProfile);

// GET all doctors
router.get("/", getDoctors);

// GET single doctor by ID
router.get("/:id", getDoctorById);

// POST create new doctor
router.post("/", createDoctor);

module.exports = router;
