const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientAuthController');
const { patientRegisterValidation, loginValidation } = require('../utils/authValidation');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');

router.post('/register', patientRegisterValidation, validate, controller.registerPatient);
router.post('/login', loginValidation, validate, controller.loginPatient);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);


// Example protected route
router.get('/me', auth('patient'), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
