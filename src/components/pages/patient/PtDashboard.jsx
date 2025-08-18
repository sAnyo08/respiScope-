"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PatientCard from "../../utils/PatientCard"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardTitle, CardHeader } from "../../ui/Card"
import History from "../../utils/History"
import PatientPortal from "../../utils/record/Record"
import PaitentDoctors from "../../utils/patientDoctors"

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")

  const tabs = [
    { name: "Home", icon: <Home className="w-4 h-4" /> },
    { name: "Record", icon: <Mic className="w-4 h-4" /> },
    { name: "Profile", icon: <User className="w-4 h-4" /> },
    { name: "Doctors", icon: <Users className="w-4 h-4" /> },
    { name: "History", icon: <Clock className="w-4 h-4" /> },
  ]

  const patients = [
    { id: 1, name: "Arjun Mehta", age: 32, gender: "Male", lastVisit: "2024-07-10", condition: "Asthma", status: "Active" },
    { id: 2, name: "Priya Sharma", age: 27, gender: "Female", lastVisit: "2024-06-18", condition: "Diabetes", status: "Follow-up" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">MediConnect</h1>
                <p className="text-sm text-gray-500">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sanyo Fonseca</p>
                <p className="text-xs text-gray-500">Patient ID: 207017</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
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
        {activeTab === "Home" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                    <p className="text-sm text-gray-500 mt-1">0 pending</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Doctors</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                    <p className="text-sm text-gray-500 mt-1">Ready for consultation</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Checkup</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">None</p>
                    <p className="text-sm text-gray-500 mt-1">No consultations yet</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "Record" && (
          <div className="bg-mint-500 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <PatientPortal />
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="bg-mint-500 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-mint-50 mb-4">Profile</h2>
            <p className="text-mint-200">Patient profile details coming soon...</p>
          </div>
        )}

        {activeTab === "History" && <History />}

        {activeTab === "Doctors" && (
          <PaitentDoctors />
        )}
      </main>
    </div>
  )
}

export default PatientDashboard
