# RespiScope Backend API

This repository contains the backend service for the **RespiScope** application. It provides RESTful APIs for user authentication, consultation management, messaging (text, audio, files), real-time communication, and IoT integrations.

## 🚀 Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-Time Communication:** Socket.IO / WebSocket (`ws`)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Storage:** GridFS (via `multer-gridfs-storage` & `multer`)
- **Testing:** Jest, Supertest, MongoDB Memory Server
- **Security & Utilities:** `helmet`, `cors`, `express-rate-limit`, `cookie-parser`, `express-validator`

## 📂 Folder Structure

The project code is organized as follows:

```
backend/
├── src/
│   ├── config/       # Environment & Database configurations
│   ├── controllers/  # Request handlers and core business logic
│   ├── matlab/       # MATLAB scripts for medical audio processing
│   ├── middleware/   # Custom middleware (auth, file uploads, validation)
│   ├── models/       # Mongoose schemas (Doctor, Patient, User, Consultation, Message)
│   ├── routes/       # Express route definitions mapped to controllers
│   ├── sockets/      # Socket.IO event handlers for real-time features
│   ├── utils/        # Helper functions and validators (e.g., WAV headers)
│   ├── app.js        # Express application setup and middleware pipeline
│   └── server.js     # Server entry point and HTTP startup
├── tests/            # Jest unit and integration tests
├── .env              # Environment variables (Git-ignored)
└── package.json      # Dependencies and scripts
```

## 🛠 Features & Concepts

- **Role-Based Authentication:** Distinct registration and login portals for Doctors and Patients using JWTs embedded in HTTP-only cookies.
- **Consultation Management:** Patients can initiate consultations with Doctors, bridging communication into dedicated active sessions.
- **Real-Time Chat:** Integrated WebSockets for real-time text and audio/file messaging during active consultations.
- **IoT Device Integration:** Custom REST endpoint specifically meant to capture high-throughput stream recordings from connected medical IoT stethoscopes, streaming directly into MongoDB GridFS.
- **Medical Audio Processing:** Audio uploaded from IoT devices or apps can be subjected to MATLAB script analysis directly from the server.
- **Security:** Helmet for securing HTTP headers and `express-rate-limit` to prevent brute-force attacks.

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check if server is up and running.

### 🔑 Authentication Routes (`/api/auth`)
- `POST /api/auth/register/doctor` - Register a new doctor.
- `POST /api/auth/register/patient` - Register a new patient.
- `POST /api/auth/login/:role` - Login a user by role (`doctor` or `patient`).
- `POST /api/auth/:role/refresh` - Refresh access token using secure cookie.
- `POST /api/auth/logout/:role` - Logout and clear authentication cookies.

*(Example Payload for Login)*
```json
{
  "email": "doctor@example.com",
  "password": "securepassword123"
}
```

### 👤 Patient Routes (`/api/patients`)
- `GET /api/patients/profile` - Get logged-in patient's profile (Authenticated).
- `GET /api/patients/` - Get all patients.
- `GET /api/patients/:id` - Get specific patient by ID.
- `POST /api/patients/` - Create a new patient manually.

### 👨‍⚕️ Doctor Routes (`/api/doctors`)
- `GET /api/doctors/profile` - Get logged-in doctor's profile (Authenticated).
- `GET /api/doctors/` - Get all doctors.
- `GET /api/doctors/:id` - Get specific doctor by ID.
- `GET /api/doctors/patient/:patientId` - Get a summary of patients treated by the doctor.
- `POST /api/doctors/` - Create a new doctor manually.

### 🩺 Consultation Routes (`/api/consultations`)
- `POST /api/consultations/` - Create a new consultation. Requires `{ "doctorId": "<id>" }` payload.
- `GET /api/consultations/patient` - Get all consultations for the logged-in patient.
- `GET /api/consultations/doctor` - Get all consultations for the logged-in doctor.
- `GET /api/consultations/:consultationId` - Look up a specific consultation.
- `GET /api/consultations/:consultationId/participant` - Fetch the other participant's details for a given consultation.

### 💬 Messaging Routes (`/api/messages`)
- `POST /api/messages/text` - Send a text message inside a consultation.
- `POST /api/messages/file` - Upload file data using `multipart/form-data`.
- `GET /api/messages/consultation/:consultationId` - Fetch complete message history for a consultation.
- `GET /api/messages/file/:id` - Fetch/stream a specific secure file buffer.
- `GET /api/messages/file/public/:id` - Fetch/stream a file resource publicly.
- `GET /api/messages/consultation/:id/audio` - Fetch only audio messages within a consultation.

### 🎙 Audio & Medical Processing Routes (`/api/audio`)
- `POST /api/audio/process/:messageId` - Trigger backend MATLAB processing for a recorded message (Doctor Only).

### 🖥 IoT Data Sync (`/api/iot`)
- `POST /api/iot/upload/:consultationId` - Accepts raw binary octet-streams (`application/octet-stream`) from IoT devices, prepends WAV headers, and pipes directly to GridFS buckets.

## ⚙️ Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure you provide a `.env` file with appropriate configuration (`MONGO_URI`, `JWT_SECRET`, etc.).
3. Start the server (Dev mode):
   ```bash
   npm run dev
   ```
4. Run Testing Suite:
   ```bash
   npm run test
   ```
