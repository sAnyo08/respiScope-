import React, { useState } from "react";
import PatientAuth from "./PatientAuth";
import DoctorAuth from "./DrAuth";

export default function AuthPage() {
  const [role, setRole] = useState("patient"); // "patient" or "doctor"

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* Logo + Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <span className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full text-2xl font-bold">
            🩺
          </span>
        </div>
        <h1 className="text-2xl font-bold text-green-700">RespiScope</h1>
        <p className="text-gray-500 text-sm">IoT Stethoscope System</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-green-50 shadow-lg rounded-2xl p-6">
        {/* Role Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`w-1/2 py-2 text-sm font-medium rounded-lg ${
              role === "patient"
                ? "bg-white text-green-700 shadow"
                : "bg-green-100 text-gray-600"
            }`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium rounded-lg ${
              role === "doctor"
                ? "bg-white text-green-700 shadow"
                : "bg-green-100 text-gray-600"
            }`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        {/* Dynamic Auth Form */}
        {role === "patient" ? <PatientAuth /> : <DoctorAuth />}
      </div>
    </div>
  );
}
