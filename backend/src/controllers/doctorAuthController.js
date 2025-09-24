const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// Register Doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { name, phone, password, degree, experience, address, hospital } = req.body;

    let existingDoctor = await Doctor.findOne({ phone });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      phone,
      degree,
      experience,
      address,
      hospital,
      password: hashedPassword,
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Doctor
exports.loginDoctor = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const doctor = await Doctor.findOne({ phone });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: doctor._id, role: "doctor" }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: doctor._id, role: "doctor" }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    doctor.refreshToken = refreshToken;
    await doctor.save();

    res.json({ accessToken, refreshToken, doctor });
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
    if (payload.role !== 'doctor') return res.status(403).json({ message: 'Role mismatch' });

    const doctor = await Doctor.findById(payload.id);
    if (!doctor || doctor.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token (not matched)' });
    }

    const newAccessToken = signAccessToken({ id: doctor._id, role: 'doctor' });
    const newRefreshToken = signRefreshToken({ id: doctor._id, role: 'doctor' });

    doctor.refreshToken = newRefreshToken;
    await doctor.save();

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
      // try to decode to find user and clear refreshToken
      try {
        const payload = verifyRefreshToken(token);
        if (payload && payload.role === 'doctor') {
          const doctor = await Doctor.findById(payload.id);
          if (doctor) {
            doctor.refreshToken = null;
            await doctor.save();
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

// module.exports = { registerDoctor, loginDoctor, refresh, logout };
