"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PatientCard from "../../utils/PatientCard" // ✅ import the reusable card
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope, UserPlus ,UserPen, ClipboardClock, CalendarCheck } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardTitle, CardHeader } from "../../ui/Card"
import { AuthContext } from "../../../context/authContext"
import { getPatients } from "../../../services/api/patientService.js"
import { getAllConsultationsMessages } from "../../../services/api/consultationService.js"
import DoctorProfile from "../../../components/utils/doctorProfile"
import Navbar from "../../utils/Navbar"


const DoctorDashboard = () => {
  const { user, login } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Dashboard")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")

  const tabs = [
    { name: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { name: "Consultations", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Patients", icon: <UserPlus  className="w-4 h-4" /> },
    { name: "Profile", icon: <UserPen ser className="w-4 h-4" /> },
  ]

  const metrics = [
    { title: "Total Patients", value: "4", subtitle: "Registered patients", icon: <Users /> },
    { title: "Consultations", value: "0", subtitle: "Total consultations", icon: <UserCheck /> },
    { title: "Pending", value: "0", subtitle: "Awaiting review", icon: <ClipboardClock/> },
    { title: "Experience", value: "12", subtitle: "Years of practice", icon: <CalendarCheck /> },
  ]

  // const patients = [
  //   { id: 1, name: "John Smith", age: 45, gender: "Male", lastVisit: "2024-01-15", condition: "Hypertension", status: "Active" },
  //   { id: 2, name: "Sarah Johnson", age: 32, gender: "Female", lastVisit: "2024-01-14", condition: "Asthma", status: "Active" },
  //   { id: 3, name: "Michael Brown", age: 58, gender: "Male", lastVisit: "2024-01-13", condition: "Diabetes", status: "Follow-up" },
  //   { id: 4, name: "Emily Davis", age: 28, gender: "Female", lastVisit: "2024-01-12", condition: "Migraine", status: "Active" },
  // ]

  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getAllConsultationsMessages()
        setConsultations(data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      {/* Header */}
      <Navbar />

      {/* Navigation Tabs */}
      {/* <nav className="bg-mint-500 border-b border-mint-700 shadow-sm">
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
      </nav> */}
      <nav className="bg-white px-6 py-4">
        <div className="flex items-center justify-center gap-8">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={activeTab === tab.name ? "outline" : "ghost"}
              className={`flex items-center gap-2 ${activeTab === tab.name ? "bg-white border-2 border-teal-700 text-teal-700 px-6" : "text-gray-600 hover:text-teal-700"}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              {tab.name}
            </Button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeTab === "Dashboard" && (
          <div>
            {/* <div className="space-y-8"> */}
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-mint-400 rounded-2xl p-2 border border-mint-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Card className="bg-blue-50 border-blue-300 border-2">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{metric.subtitle}</p>
                      </div>
                      <div className="text-4xl text-mint-50">{metric.icon}</div>
                    </CardContent>
                  </Card>
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
            {/* Consultation History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations.map((consultation) => (
                <PatientCard key={consultation.id} patient={consultation} />
              ))}
            </div>
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
          <DoctorProfile />
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
