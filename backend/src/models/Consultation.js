// models/consultation.js
const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  type: { type: String, enum: ["heart", "lungs"], required: true, default: "heart" },
  status: { 
    type: String, 
    enum: ["pending", "active", "recording", "submitted", "reviewed", "closed"], 
    default: "pending" 
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Consultation", ConsultationSchema);
