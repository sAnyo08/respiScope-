const { body } = require("express-validator");

const doctorRegisterValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone")
    .isMobilePhone("any").withMessage("Invalid phone number"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 chars long"),
];

const patientRegisterValidation = [
  body("name").isLength({ min: 2 }).withMessage("Name too short"),
  body("phone").isMobilePhone("any").withMessage("Invalid phone"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be >= 6 chars"),
];

const loginValidation = [
  body("phone").isMobilePhone("any").withMessage("Invalid phone"),
  body("password").exists().withMessage("Password required"),
];

module.exports = {
  doctorRegisterValidation,
  patientRegisterValidation,
  loginValidation,
};
