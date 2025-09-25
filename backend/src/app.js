const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const doctorAuthRoutes = require('./routes/doctorAuth');
const patientAuthRoutes = require('./routes/patientAuth');


const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80
});
app.use(limiter);

app.use('/api/auth/doctor', doctorAuthRoutes);
app.use('/api/auth/patient', patientAuthRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

module.exports = app;
