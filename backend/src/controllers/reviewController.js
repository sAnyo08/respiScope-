const Consultation = require("../models/Consultation");
const DoctorReview = require("../models/DoctorReview");

// Submit a review for a consultation
exports.submitReview = async (req, res) => {
  try {
    const { consultationId, diagnosis, comments, severity } = req.body;
    const doctorId = req.user._id;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: "Forbidden: You are not the doctor for this consultation" });
    }

    const review = new DoctorReview({
      consultationId,
      doctorId,
      diagnosis,
      comments,
      severity: severity || "low"
    });

    await review.save();

    // Update consultation status to reviewed
    await Consultation.findByIdAndUpdate(consultationId, { status: "reviewed" });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get review for a consultation
exports.getReviewByConsultationId = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const review = await DoctorReview.findOne({ consultationId }).populate("doctorId", "name specialization");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
