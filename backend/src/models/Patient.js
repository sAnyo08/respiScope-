// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const PatientSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   age: { type: Number },
//   gender: { type: String },
//   address: { type: String },
//   height: { type: Number },
//   weight: { type: Number },
//   priorDisease: { type: String },
//   phone: { type: String, required: true, unique: true }, // <-- Unique login field
//   password: { type: String, required: true },
//   refreshToken: { type: String }
// }, { timestamps: true });

// // Hash password before save
// PatientSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// PatientSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// PatientSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.refreshToken;
//   return obj;
// };

// module.exports = mongoose.model('Patient', PatientSchema);

const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to User
  name: { type: String, trim: true },
  phone: { type: String, required: true, unique: true }, // unique login field
  age: { type: Number },
  gender: { type: String },
  address: { type: String },
  height: { type: Number },
  weight: { type: Number },
  priorDisease: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);
