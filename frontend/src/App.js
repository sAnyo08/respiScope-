import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/protectedRoute";

// Lazy Loaded Components for React Optimization
const Landing = lazy(() => import("./components/pages/landing"));
const DoctorAuthPage = lazy(() => import("./services/auth/DoctorAuthPage"));
const PatientAuthPage = lazy(() => import("./services/auth/PatientAuthPage"));
const DoctorDashboard = lazy(() => import("./components/pages/doctor/DrDashboard"));
const PatientDashboard = lazy(() => import("./components/pages/patient/PtDashboard"));
const DrPatients = lazy(() => import("./components/pages/doctor/DrPatients"));
const SendMessagePage = lazy(() => import("./components/pages/sendMessagePage"));
const DoctorPatientChat = lazy(() => import("./components/pages/ChatMessage"));
const PatientDetails = lazy(() => import("./components/pages/doctor/PatientDetails"));
const AdminDashboard = lazy(() => import("./components/pages/AdminDashboard"));
const AdminAuth = lazy(() => import("./services/auth/AdminAuthPage"));

// Page Transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/doctor-login" element={<PageWrapper><DoctorAuthPage /></PageWrapper>} />
        <Route path="/patient-login" element={<PageWrapper><PatientAuthPage /></PageWrapper>} />
        <Route path="/admin-login" element={<PageWrapper><AdminAuth /></PageWrapper>} />

        {/* Messaging Route */}
        <Route
          path="/message/:consultationId"
          element={
            <ProtectedRoute requiredRole={["patient", "doctor"]}>
              <PageWrapper><SendMessagePage /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Doctor Protected */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <PageWrapper><DoctorDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/drpatients"
          element={
            <ProtectedRoute requiredRole="doctor">
              <PageWrapper><DrPatients /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:patientId"
          element={
            <ProtectedRoute requiredRole="doctor">
              <PageWrapper><PatientDetails /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Patient Protected */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PageWrapper><PatientDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
              <PageWrapper><AdminDashboard /></PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#10141a] text-teal-600 font-bold">Loading...</div>}>
            <AnimatedRoutes />
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
