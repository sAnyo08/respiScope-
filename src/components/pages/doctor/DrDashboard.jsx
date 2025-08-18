"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PatientCard from "../../utils/PatientCard" // ✅ import the reusable card

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")

  const tabs = [
    { name: "Dashboard", icon: "♥" },
    { name: "Consultations", icon: "💬" },
    { name: "Patients", icon: "👥" },
    { name: "Profile", icon: "👤" },
  ]

  const metrics = [
    { title: "Total Patients", value: "4", subtitle: "Registered patients", icon: "👥" },
    { title: "Consultations", value: "0", subtitle: "Total consultations", icon: "📊" },
    { title: "Pending", value: "0", subtitle: "Awaiting review", icon: "⏰" },
    { title: "Experience", value: "12", subtitle: "Years of practice", icon: "📅" },
  ]

  const patients = [
    { id: 1, name: "John Smith", age: 45, gender: "Male", lastVisit: "2024-01-15", condition: "Hypertension", status: "Active" },
    { id: 2, name: "Sarah Johnson", age: 32, gender: "Female", lastVisit: "2024-01-14", condition: "Asthma", status: "Active" },
    { id: 3, name: "Michael Brown", age: 58, gender: "Male", lastVisit: "2024-01-13", condition: "Diabetes", status: "Follow-up" },
    { id: 4, name: "Emily Davis", age: 28, gender: "Female", lastVisit: "2024-01-12", condition: "Migraine", status: "Active" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      {/* Header */}
      <header className="bg-mint-600 shadow-md border-b border-mint-700">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-mint-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-mint-50">RespiScope</h1>
              <p className="text-sm text-mint-100">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-mint-50">Dr. Sanyo</p>
              <p className="text-xs text-mint-200">Code: DOC579789</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-1 bg-mint-300 rounded-lg hover:bg-mint-400 transition-colors text-mint-50 font-medium shadow-sm"
            >
              <span>↗</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-mint-500 border-b border-mint-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.name
                    ? "border-mint-50 text-mint-50"
                    : "border-transparent text-mint-200 hover:text-mint-50 hover:border-mint-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeTab === "Dashboard" && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-mint-400 rounded-2xl p-6 border border-mint-600 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-mint-50">{metric.title}</p>
                      <p className="text-3xl font-bold text-mint-50 mt-2">{metric.value}</p>
                      <p className="text-sm text-mint-200 mt-1">{metric.subtitle}</p>
                    </div>
                    <div className="text-3xl text-mint-50">{metric.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Consultations */}
            <div className="bg-green-100 rounded-2xl border border-mint-700 shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold text-mint-50 mb-2">Recent Consultations</h2>
              <p className="text-sm text-mint-200 mb-8">
                Latest patient consultations requiring your attention
              </p>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-mint-300 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl text-mint-50">💬</span>
                </div>
                <p className="text-mint-50 text-center">No consultations yet</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Consultations" && (
          <div className="bg-green-100 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-mint-50 mb-4">Consultations</h2>
            <p className="text-mint-200">Consultation management coming soon...</p>
          </div>
        )}

        {activeTab === "Patients" && (
          <div className="bg-mint-500 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-mint-50 mb-6">Patients</h2>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="bg-mint-500 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-mint-50 mb-4">Profile</h2>
            <p className="text-mint-200">Profile settings coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
