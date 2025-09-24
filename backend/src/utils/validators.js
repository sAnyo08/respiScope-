const { body } = require('express-validator');

const doctorRegisterValidation = [
  body('name').isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be >= 6 chars')
];

const patientRegisterValidation = [
  body('name').isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be >= 6 chars')
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required')
];

module.exports = {
  doctorRegisterValidation,
  patientRegisterValidation,
  loginValidation
};
