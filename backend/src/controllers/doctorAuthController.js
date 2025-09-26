const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// Register Doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { name, phone, password, degree, experience, address, hospital } =
      req.body;

    let existingDoctor = await Doctor.findOne({ phone });
    if (existingDoctor) {
      return res
        .status(409)
        .json({ message: "Doctor already exists with this phone number" });
    }

    // NOTE: Schema handles password hashing in pre('save'), so pass plain password here
    const newDoctor = new Doctor({
      name,
      phone,
      degree,
      experience,
      address,
      hospital,
      password, // plain — model pre-save will hash
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error("registerDoctor error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Login Doctor
exports.loginDoctor = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const doctor = await Doctor.findOne({ phone });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Use model method for comparison (keeps logic centralized)
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use jwt utils to sign tokens (consistent env names)
    const accessToken = signAccessToken({ id: doctor._id, role: "doctor" });
    const refreshToken = signRefreshToken({ id: doctor._id, role: "doctor" });

    // Hash refresh token before saving to DB
    const hashedRefresh = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    doctor.refreshToken = hashedRefresh;
    await doctor.save();

    // Set cookie for refresh token securely in production
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_MAX_AGE_MS, 10) ||
        7 * 24 * 60 * 60 * 1000, // default 7 days
    });

    // don't send raw refresh token in body; access token only
    res.json({ accessToken, doctor: doctor.toJSON() });
  } catch (err) {
    console.error("loginDoctor error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid refresh token" });
    if (payload.role !== "doctor")
      return res.status(403).json({ message: "Role mismatch" });

    const doctor = await Doctor.findById(payload.id);
    if (!doctor) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare hashed refresh token
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    if (doctor.refreshToken !== hashed) {
      return res
        .status(401)
        .json({ message: "Invalid refresh token (not matched)" });
    }

    const newAccessToken = signAccessToken({ id: doctor._id, role: "doctor" });
    const newRefreshToken = signRefreshToken({ id: doctor._id, role: "doctor" });

    // Save hashed new refresh token
    doctor.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await doctor.save();

    // Set cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_MAX_AGE_MS, 10) ||
        7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("refresh error:", err);
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload && payload.role === "doctor") {
          const doctor = await Doctor.findById(payload.id);
          if (doctor) {
            doctor.refreshToken = null;
            await doctor.save();
          }
        }
      } catch (e) {
        // Log but don't fail logout if token invalid/expired
        console.error("logout token verify failed:", e.message || e);
      }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error("logout error:", err);
    next(err);
  }
};
