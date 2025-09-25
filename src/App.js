// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PatientAuth from './components/Auth/PatientAuth';
// import DoctorLogin from "./components/Auth/DrAuth";
// import AuthPage from "./components/Auth/AuthPage";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Default page "/" */}
//           <Route path="/" element={<AuthPage />} />

//           {/* Separate routes */}
//           <Route path="/patient-auth" element={<PatientAuth />} />
//           <Route path="/doctor-auth" element={<DoctorLogin />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PatientAuth from "../src/services/auth/PatientAuth"
import Landing from "../src/components/pages/landing"
import DoctorAuth from "../src/services/auth/DrAuth"
import DoctorDashboard from "../src/components/pages/doctor/DrDashboard"
import PatientDashboard from "../src/components/pages/patient/PtDashboard"
import DrPatients from "../src/components/pages/doctor/DrPatients"
import "./App.css"

function App() {
  return (
    <Router>
      
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient-login" element={<PatientAuth />} />
          <Route path="/doctor-login" element={<DoctorAuth />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/drpatients" element={<DrPatients />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App