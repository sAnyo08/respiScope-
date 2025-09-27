// controllers/profileController.js
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const User = require("../models/User");

// Get current user profile based on role
exports.getProfile = async (req, res) => {
  try {
    const role = req.params.role; // from route: /api/profile/:role
    const userId = req.user.id; // from JWT middleware

    // Validate role
    if (!["doctor", "patient"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Verify user exists and has correct role
    const user = await User.findById(userId);
    if (!user || user.role !== role) {
      return res.status(404).json({ message: "User not found or role mismatch" });
    }

    let profileData;

    // Fetch profile based on role
    if (role === "doctor") {
      profileData = await Doctor.findOne({ userId }).lean();
    } else if (role === "patient") {
      profileData = await Patient.findOne({ userId }).lean();
    }

    if (!profileData) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Add role and phone from User model to profile data
    profileData.role = user.role;
    profileData.phone = user.phone;

    res.json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};