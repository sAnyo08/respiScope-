// // const { body } = require("express-validator");

// // const doctorRegisterValidation = [
// //   body("name").notEmpty().withMessage("Name is required"),
// //   body("phone")
// //     .isMobilePhone("any").withMessage("Invalid phone number"),
// //   body("password")
// //     .isLength({ min: 6 }).withMessage("Password must be at least 6 chars long"),
// // ];

// // const patientRegisterValidation = [
// //   body("name").isLength({ min: 2 }).withMessage("Name too short"),
// //   body("phone").isMobilePhone("any").withMessage("Invalid phone"),
// //   body("password")
// //     .isLength({ min: 6 })
// //     .withMessage("Password must be >= 6 chars"),
// // ];

// // const loginValidation = [
// //   body("phone").isMobilePhone("any").withMessage("Invalid phone"),
// //   body("password").exists().withMessage("Password required"),
// // ];

// // module.exports = {
// //   doctorRegisterValidation,
// //   patientRegisterValidation,
// //   loginValidation,
// // };

// // validators/authValidation.js
// const { body } = require("express-validator");

// // Common validators
// const commonRegisterValidation = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("phone")
//     .isMobilePhone("any")
//     .withMessage("Invalid phone number"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters long"),
// ];

// // Doctor-specific validators
// const doctorExtraValidation = [
//   body("degree").notEmpty().withMessage("Degree is required"),
//   body("experience")
//     .isInt({ min: 0 })
//     .withMessage("Experience must be a non-negative number"),
//   body("hospital").notEmpty().withMessage("Hospital is required"),
// ];

// // Patient-specific validators
// const patientExtraValidation = [
//   body("age")
//     .optional()
//     .isInt({ min: 0 })
//     .withMessage("Age must be a positive number"),
//   body("address")
//     .optional()
//     .isString()
//     .withMessage("Address must be a string"),
// ];

// // Exports
// const registerValidation = (role) => {
//   switch (role) {
//     case "doctor":
//       return [...commonRegisterValidation, ...doctorExtraValidation];
//     case "patient":
//       return [...commonRegisterValidation, ...patientExtraValidation];
//     default:
//       return commonRegisterValidation;
//   }
// };

// const loginValidation = [
//   body("phone").isMobilePhone("any").withMessage("Invalid phone number"),
//   body("password").exists().withMessage("Password is required"),
// ];

// module.exports = {
//   registerValidation,
//   loginValidation,
// };

const { body } = require("express-validator");

const registerValidation = (role) => {
  if (role === "doctor") {
    return [
      body("name").notEmpty().withMessage("Name is required"),
      body("phone").isMobilePhone("any").withMessage("Invalid phone number"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long"),
    ];
  }
  if (role === "patient") {
    return [
      body("name").isLength({ min: 2 }).withMessage("Name too short"),
      body("phone").isMobilePhone("any").withMessage("Invalid phone"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be >= 6 chars"),
    ];
  }
  return [];
};

const loginValidation = [
  body("phone").isMobilePhone("any").withMessage("Invalid phone"),
  body("password").exists().withMessage("Password required"),
];

module.exports = { registerValidation, loginValidation };
