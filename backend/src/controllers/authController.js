const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const User = require("../models/User");
const crypto = require("crypto");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// Map role -> User
const getUser = (role) => {
  if (role === "doctor") return Doctor;
  if (role === "patient") return Patient;
  throw new Error("Invalid role write in smallcase");
};

// Register
exports.register = async (req, res) => {
  try {
    const role = req.role || req.params.role || req.body.role;
    // const User = getUser(role);
    if (!["doctor", "patient"].includes(role)) {
      return res.status(400).json({ message: "Invalid role, write in smallcase" });
    }

    const { name, phone, password, ...rest } = req.body;

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: `${role} already exists` });
    }

    const user = new User({ name, phone, password, role, ...rest });
    await user.save();
    // Create role-specific profile
    if (role === "doctor") {
      const doctorProfile = new Doctor({ userId: user._id, name, phone, ...rest });
      await doctorProfile.save();
    } else if (role === "patient") {
      const patientProfile = new Patient({ userId: user._id, name, phone, ...rest });
      await patientProfile.save();
    }


    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    // 🔥 ROLLBACK user if profile creation failed
    if (user?._id) {
      await User.findByIdAndDelete(user._id);
    }
    
    console.error("register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const role = req.params.role;
    const { phone, password } = req.body;

    const user = await User.findOne({ phone, role });
    if (!user) return res.status(404).json({ message: `${role} not found` });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken({ id: user._id, role });
    const refreshToken = signRefreshToken({ id: user._id, role });

    // Hash refresh token
    user.refreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_MAX_AGE_MS, 10) ||
        7 * 24 * 60 * 60 * 1000,
    });

     // ✅ Return the correct user data based on role
     let userData;
     if (role === "doctor") {
       const doctor = await Doctor.findOne({ userId: user._id });
       userData = doctor;
     } else {
       const patient = await Patient.findOne({ userId: user._id });
       userData = patient;
     }

     res.json({ 
      accessToken, 
      user: userData, 
      role 
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Refresh token
exports.refresh = async (req, res) => {
  try {
    const role = req.params.role;
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(token);
    if (!payload || payload.role !== role)
      return res.status(401).json({ message: "Invalid refresh token" });

    
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    if (user.refreshToken !== hashed)
      return res.status(401).json({ message: "Token mismatch" });

    const newAccessToken = signAccessToken({ id: user._id, role });
    const newRefreshToken = signRefreshToken({ id: user._id, role });

    user.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await user.save();

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
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const role = req.params.role;
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload && payload.role === role) {
          const User = getUser(role);
          const user = await User.findById(payload.id);
          if (user) {
            user.refreshToken = null;
            await user.save();
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
    res.status(500).json({ message: err.message || "Server error" });
  }
};
