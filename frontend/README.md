# RespiScope Frontend

This repository contains the frontend client for the **RespiScope** application. It provides the user interface for both Doctors and Patients, facilitating role-based authentication, real-time consultation messaging, and medical audio insights.

## 🚀 Tech Stack

- **Framework:** React.js (Bootstrapped with Create React App)
- **Styling:** Tailwind CSS
- **Routing:** React Router v7 (`react-router-dom`)
- **State Management & Auth:** Context API (`AuthContext`)
- **Real-Time Communication:** Socket.io Client (`socket.io-client`)
- **HTTP Client:** Axios
- **Audio Processing UI:** WaveSurfer.js (`wavesurfer.js`)
- **Icons:** Lucide React (`lucide-react`)

## 📂 Folder Structure

The frontend application code is primarily housed within the `src/` directory, organized by feature responsibility:

```
frontend/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── common/         # Common layout elements (e.g., ProtectedRoute)
│   │   ├── pages/          # Full page views
│   │   │   ├── doctor/     # Doctor-specific pages (Dashboard, Patient Lists)
│   │   │   ├── patient/    # Patient-specific pages
│   │   │   └── ChatMessage.js / sendMessagePage.js # Messaging interfaces
│   │   └── ui/             # Granular UI components (Buttons, Inputs, Modals)
│   ├── context/            # React Contexts
│   │   └── authContext.js  # Global Authentication and Profile State
│   ├── services/           # External service integration
│   │   ├── api/            # Axios API endpoint definitions
│   │   └── auth/           # Authentication handlers and API calls
│   ├── socket.js           # Socket.IO client configuration
│   ├── App.js              # Application root and Router configuration
│   └── index.js            # React DOM rendering entry point
├── tailwind.config.js      # Tailwind CSS configuration overrides
└── package.json            # Node.js dependencies and scripts
```

## 🛠 Features & Concepts

- **Role-Based Dashboards:** Separate protected route structures for Doctors (`/doctor-dashboard`, `/drpatients`) and Patients (`/patient-dashboard`). Role validation is handled directly by `ProtectedRoute` wrapper components.
- **Global Authentication State:** Utilizes React Context API (`AuthContext.jsx`) to manage JWT tokens stored in `localStorage` and automatically fetch profiles upon reload.
- **Real-Time Consultations:** Chat and messaging features leverage WebSocket connections initialized in `socket.js` using `socket.io-client`, allowing immediate receipt of file and text messages dynamically linked to given `consultationId` URLs.
- **Audio Visualization:** Integration with `wavesurfer.js` gives physicians fine-grained visual tracking patterns over audio recordings originating from connected patient devices.
- **Tailwind Ecosystem:** Entire layout logic relies on functional CSS utility classes from Tailwind CSS for an immediately responsive, mobile-friendly design without heavy bespoke CSS files.

## 📡 Key App Routes

| Path | Access | Component | Description |
|------|--------|-----------|-------------|
| `/` | Public | `Landing` | Application landing page |
| `/doctor-login` | Public | `DoctorAuthPage` | Doctor authentication portal |
| `/patient-login` | Public | `PatientAuthPage` | Patient authentication portal |
| `/doctor-dashboard`| Doctor | `DoctorDashboard`| Main overview for doctors |
| `/drpatients` | Doctor | `DrPatients` | Doctor's active patient list |
| `/patients/:patientId`| Doctor | `PatientDetails` | In-depth patient clinical records |
| `/patient-dashboard`| Patient | `PatientDashboard`| Main overview for patients |
| `/message/:consultationId`| Both | `SendMessagePage` | Real-time chat & consultation workspace |

## ⚙️ Running Locally

1. Install all dependencies:
   ```bash
   npm install
   ```
2. Set up any necessary API endpoint targets in an `.env` file (if utilized), default backend targeting is usually `http://localhost:5000`.
3. Start the Vite/Webpack development server:
   ```bash
   npm start
   ```
4. Build for deployment:
   ```bash
   npm run build
   ```
