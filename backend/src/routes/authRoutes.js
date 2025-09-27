const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../utils/authValidation");
const { validate } = require("../middleware/validate");

const router = express.Router();

// Register Doctor
router.post("/register/doctor", registerValidation("doctor"), validate, (req, res) => {
  req.role = "doctor";
  register(req, res);
});

// Register Patient
router.post("/register/patient", registerValidation("patient"), validate, (req, res) => {
  req.role = "patient";
  register(req, res);
});

// Login (role in URL)
router.post("/login/:role", loginValidation, validate, login);

// Refresh (role in URL)
router.post("/refresh/:role", refresh);

// Logout (role in URL)
router.post("/logout/:role", logout);

// routes/profileRoutes.js
// const { getProfile } = require("../controllers/profileController");
// const { authenticateToken } = require("../utils/authenticationToken"); // Your JWT middleware

// GET current user profile by role
// router.get("/:role", getProfile);

module.exports = router;
