const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');

// GET /api/admin/dashboard
// Fetch all aggregated data needed for the admin dashboard.
router.get('/dashboard', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, { _id: 1, name: 1, phone: 1 });
    const patients = await Patient.find({}, { _id: 1, name: 1, phone: 1 });

    const users = [
      ...doctors.map(d => ({ id: d._id, name: d.name, identifier: d.phone, role: 'DOCTOR' })),
      ...patients.map(p => ({ id: p._id, name: p.name, identifier: p.phone, role: 'PATIENT' }))
    ];
    
    // Calculate total users
    const totalUsers = users.length;
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;

    // Latest 5 consultations
    const recentLogs = await Consultation.find({})
      .populate('doctorId', 'name')
      .populate('patientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalUsers, users, recentLogs, totalDoctors, totalPatients});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
