const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

// Base path: /api/reviews

// Submit a review (Doctor only)
router.post("/", auth("doctor"), reviewController.submitReview);

// Get review for a consultation
router.get("/consultation/:consultationId", auth(), reviewController.getReviewByConsultationId);

module.exports = router;
