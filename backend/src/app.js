const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const messageRoutes = require("./routes/messageRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

// ✅ Unified routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
// const doctorAuthRoutes = require('./routes/doctorAuth');
// const patientAuthRoutes = require('./routes/patientAuth');


const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
// app.use('/api/profile', authRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use("/api/consultations", consultationRoutes);
app.use("/message", messageRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

module.exports = app;
