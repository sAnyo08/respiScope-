const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Register Patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, phone, password, age, gender, address, height, weight, priorDisease } = req.body;

    let existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name,
      phone,
      password: hashedPassword,
      age,
      gender,
      address,
      height,
      weight,
      priorDisease
    });

    await newPatient.save();

    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Patient
exports.loginPatient = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(400).json({ message: "Patient not found" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: patient._id, role: "patient" }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: patient._id, role: "patient" }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    patient.refreshToken = refreshToken;
    await patient.save();

    res.json({ accessToken, refreshToken, patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ message: 'Invalid refresh token' });
    if (payload.role !== 'patient') return res.status(403).json({ message: 'Role mismatch' });

    const patient = await Patient.findById(payload.id);
    if (!patient || patient.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token (not matched)' });
    }

    const newAccessToken = signAccessToken({ id: patient._id, role: 'patient' });
    const newRefreshToken = signRefreshToken({ id: patient._id, role: 'patient' });

    patient.refreshToken = newRefreshToken;
    await patient.save();

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'lax' });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload && payload.role === 'patient') {
          const patient = await Patient.findById(payload.id);
          if (patient) {
            patient.refreshToken = null;
            await patient.save();
          }
        }
      } catch (e) {}
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

// module.exports = { registerPatient, loginPatient, refresh, logout };
