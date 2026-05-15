const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");
const auth = require("../middleware/authMiddleware");

// Base path: /api/consultations

// Create or fetch a consultation
router.post("/", auth("patient"), consultationController.startConsultation);

// Get consultations for logged-in patient
router.get("/patient", auth("patient"), consultationController.getPatientConsultations);

// Get consultations for logged-in doctor
router.get("/doctor", auth("doctor"), consultationController.getDoctorConsultations);

// Get specific patient consultations for logged-in doctor
router.get("/doctor/patient/:patientId", auth("doctor"), consultationController.getPatientConsultationsForDoctor);

// Add a recording point to a specific consultation
router.post("/:consultationId/points", auth("patient"), consultationController.addRecordingPoint);

// Complete a consultation session
router.post("/:consultationId/complete", auth("patient"), consultationController.completeConsultation);

// Get single consultation details (including points)
router.get("/:consultationId", auth(), consultationController.getConsultationById);

// DELETE consultation
router.delete("/:consultationId", auth(), consultationController.deleteConsultation);

// GET participant info
router.get("/:consultationId/participant", auth(), consultationController.getParticipantInfo);

module.exports = router;
