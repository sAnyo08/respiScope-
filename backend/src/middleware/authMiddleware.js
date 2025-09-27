// middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/jwt");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const auth = (allowedRole = null) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode token
    const payload = verifyAccessToken(token); // should return { id, role }
    if (!payload || !payload.id || !payload.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Role-based access check (optional)
    if (allowedRole && payload.role !== allowedRole) {
      return res.status(403).json({ message: "Forbidden: wrong role" });
    }

    // Pick model dynamically
    let Model;
    switch (payload.role) {
      case "doctor":
        Model = Doctor;
        break;
      case "patient":
        Model = Patient;
        break;
      default:
        return res.status(400).json({ message: "Unknown role in token" });
    }

    // Fetch user
    const user = await Model.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach to request for downstream use
    req.user = user;
    req.role = payload.role;

    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;
