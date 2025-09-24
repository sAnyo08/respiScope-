const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorAuthController');
const { doctorRegisterValidation, loginValidation } = require('../utils/validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');

// POST /api/auth/doctor/register
router.post('/register', doctorRegisterValidation, validate, controller.registerDoctor);

// POST /api/auth/doctor/login
router.post('/login', loginValidation, validate, controller.loginDoctor);

// POST /api/auth/doctor/refresh
router.post('/refresh', controller.refresh);

// POST /api/auth/doctor/logout
router.post('/logout', controller.logout);



// Example protected route
router.get('/me', auth('doctor'), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
