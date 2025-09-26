import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/landing";
import DoctorAuthPage from "./services/auth/DoctorAuthPage";
import PatientAuthPage from "./services/auth/PatientAuthPage";
import DoctorDashboard from "./components/pages/doctor/DrDashboard";
import PatientDashboard from "./components/pages/patient/PtDashboard";
import DrPatients from "./components/pages/doctor/DrPatients";
import ProtectedRoute from "./components/common/protectedRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/doctor-login" element={<DoctorAuthPage />} />
          <Route path="/patient-login" element={<PatientAuthPage />} />

          {/* Doctor Protected */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drpatients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DrPatients />
              </ProtectedRoute>
            }
          />

          {/* Patient Protected */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
