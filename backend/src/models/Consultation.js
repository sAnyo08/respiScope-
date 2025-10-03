// models/consultation.js
const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  status: { type: String, enum: ["pending", "active", "closed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Consultation", ConsultationSchema);
