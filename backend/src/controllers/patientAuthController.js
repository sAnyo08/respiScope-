const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// Register Patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, phone, password, age, gender, address, height, weight, priorDisease } =
      req.body;

    let existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      return res
        .status(409)
        .json({ message: "Patient already exists with this phone number" });
    }

    // Schema pre('save') will hash password
    const newPatient = new Patient({
      name,
      phone,
      password, // raw password
      age,
      gender,
      address,
      height,
      weight,
      priorDisease,
    });

    await newPatient.save();

    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error("registerPatient error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Login Patient
exports.loginPatient = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken({ id: patient._id, role: "patient" });
    const refreshToken = signRefreshToken({ id: patient._id, role: "patient" });

    // Store hashed refresh token in DB
    patient.refreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await patient.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_MAX_AGE_MS, 10) ||
        7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, patient: patient.toJSON() });
  } catch (err) {
    console.error("loginPatient error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Refresh Token
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid refresh token" });
    if (payload.role !== "patient")
      return res.status(403).json({ message: "Role mismatch" });

    const patient = await Patient.findById(payload.id);
    if (!patient) {
      return res.status(401).json({ message: "User not found" });
    }

    // Validate stored hashed token
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    if (patient.refreshToken !== hashed) {
      return res.status(401).json({ message: "Invalid refresh token (not matched)" });
    }

    const newAccessToken = signAccessToken({ id: patient._id, role: "patient" });
    const newRefreshToken = signRefreshToken({ id: patient._id, role: "patient" });

    // Save hashed new refresh token
    patient.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await patient.save();

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
    console.error("patient refresh error:", err);
    next(err);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload && payload.role === "patient") {
          const patient = await Patient.findById(payload.id);
          if (patient) {
            patient.refreshToken = null;
            await patient.save();
          }
        }
      } catch (e) {
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
