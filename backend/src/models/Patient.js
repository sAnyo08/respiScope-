const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number },
  phone: { type: String, unique: true, required: true },
  gender: { type: String },
  address: { type: String },
  height: { type: Number },
  weight: { type: Number },
  priorDisease: { type: String },
  refreshToken: { type: String }
}, { timestamps: true });


PatientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

PatientSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

PatientSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('Patient', PatientSchema);
