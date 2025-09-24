const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  degree :{ type: String},
  experience : { type: String},
  address : {type: String},
  password: { type: String, required: true },
  hospital: { type: String },
  phone: { type: String },
  refreshToken: { type: String } // store refresh token hash or token (optional)
}, { timestamps: true });

// Hash password before save
DoctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

DoctorSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

DoctorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('Doctor', DoctorSchema);
