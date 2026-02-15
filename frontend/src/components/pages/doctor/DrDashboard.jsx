"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PatientCard from "../../utils/PatientCard"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope, UserPlus, UserPen, ClipboardClock, CalendarCheck, MessageSquare, ArrowRight, Phone, Mail } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardTitle, CardHeader } from "../../ui/Card"
import { AuthContext } from "../../../context/authContext.js"
import { getPatients } from "../../../services/api/patientService.js"
import { getDoctorConsultations, getConsultationsMessages } from "../../../services/api/consultationService.js"
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
    { name: "Patients", icon: <UserPlus className="w-4 h-4" /> },
    { name: "Profile", icon: <UserPen className="w-4 h-4" /> },
  ]

  const metrics = [
    { title: "Total Patients", value: "4", subtitle: "Registered patients", icon: <Users /> },
    { title: "Consultations", value: "0", subtitle: "Total consultations", icon: <UserCheck /> },
    { title: "Pending", value: "0", subtitle: "Awaiting review", icon: <ClipboardClock /> },
    { title: "Experience", value: "12", subtitle: "Years of practice", icon: <CalendarCheck /> },
  ]

  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients", error.message);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getDoctorConsultations()
        setConsultations(data);
      } catch (error) {
        console.error("Failed to load consultations", error.message);
      }
    };

    fetchConsultations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getConsultationsMessages();
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to load consultations messages", error.message);
      }

    };

    fetchMessages();
  }, []);

  const handleOpenChat = async(c) => {
    console.log("Opening chat for consultation:", c._id);

    try {
      navigate(`/message/${c._id}`, { state: { consultationId: c._id } });
    } catch (error) {
      console.error("Failed to open consultation", error.message);
      alert(`Failed to open consultation: ${error.message}`);
    }
  };

  const onViewDetails = async(patient) => {
    try {
      navigate(`/patients/${patient._id}`);
    } catch (error) {
      console.error("Failed to open patient details", error.message);
      alert(`Failed to open patient details: ${error.message}`);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      {/* Header */}
      <Navbar
        userType="doctor"
        userName={`Dr. ${user?.name || "Doctor"}`}
        userCode={user?.code || user?._id?.slice(-6) || "DOC123"}
      />

      <nav className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center gap-8">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={activeTab === tab.name ? "outline" : "ghost"}
              className={`flex items-center gap-2 transition-all duration-200 ${
                activeTab === tab.name 
                  ? "bg-white border-2 border-teal-600 text-teal-700 px-6 shadow-sm" 
                  : "text-gray-600 hover:text-teal-700 hover:bg-teal-50"
              }`}
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
          <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Patients */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-white rounded-xl p-6 h-full border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-blue-100 rounded-full">
                    <span className="text-xs font-semibold text-blue-700">Active</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{patients.length}</p>
                  <p className="text-sm text-gray-500">Registered patients</p>
                </div>
              </div>
            </div>

            {/* Total Consultations */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-white rounded-xl p-6 h-full border-2 border-teal-200 group-hover:border-teal-400 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <UserCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-teal-100 rounded-full">
                    <span className="text-xs font-semibold text-teal-700">All Time</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Consultations</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{consultations.length}</p>
                  <p className="text-sm text-gray-500">Total consultations</p>
                </div>
              </div>
            </div>

            {/* Pending Consultations */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-white rounded-xl p-6 h-full border-2 border-amber-200 group-hover:border-amber-400 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ClipboardClock className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-amber-100 rounded-full">
                    <span className="text-xs font-semibold text-amber-700">Urgent</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {consultations.filter(c => c.status?.toLowerCase() === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-500">Awaiting review</p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-white rounded-xl p-6 h-full border-2 border-purple-200 group-hover:border-purple-400 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <CalendarCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-purple-100 rounded-full">
                    <span className="text-xs font-semibold text-purple-700">Career</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Experience</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {user?.experience || 12}
                  </p>
                  <p className="text-sm text-gray-500">Years of practice</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Consultations Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                  Recent Consultations
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Latest patient consultations requiring your attention
                </p>
              </div>
              {consultations.length > 0 && (
                <Button
                  onClick={() => setActiveTab("Consultations")}
                  className="bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-300"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.slice(0, 3).map((c) => (
                  <div 
                    key={c._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Patient Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {c.patientId?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        c.status?.toLowerCase() === 'pending' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : c.status?.toLowerCase() === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {c.status || 'Pending'}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleOpenChat(c)}
                      className="ml-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 group-hover:shadow-md transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <MessageSquare className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Consultations Yet</h3>
                <p className="text-gray-600 text-center max-w-md">
                  You don't have any consultations at the moment. New consultations will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Patients Today */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Active Today</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total active patients</p>
            </div>

            {/* Completed Consultations */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Completed</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {consultations.filter(c => c.status?.toLowerCase() === 'completed').length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Successfully completed</p>
            </div>

            {/* Average Response Time */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Response Time</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">~2h</p>
              <p className="text-sm text-gray-500 mt-1">Average response</p>
            </div>
          </div>
        </div>
        )}

        {activeTab === "Consultations" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Consultations</h2>
                  <p className="text-gray-600 mt-1">Manage and track all patient consultations</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg border border-teal-200">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">{consultations.length} Active</span>
                </div>
              </div>
            </div>

            {/* Consultations Grid */}
            {consultations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.map((c) => (
                  <Card 
                    key={c._id} 
                    className="bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                          {c.status || 'Pending'}
                        </span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Patient Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {c.patientId?.name || 'Unknown Patient'}
                            </h3>
                            <p className="text-sm text-gray-500">Patient ID: {c.patientId?._id?.slice(-6) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleOpenChat(c)}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Open Chat
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Consultations Yet</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    You don't have any active consultations at the moment. New consultations will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Patients" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
                  <p className="text-gray-600 mt-1">View and manage your patient records</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">{patients.length} Patients</span>
                </div>
              </div>
            </div>

            {/* Patients Grid */}
            {patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <Card 
                    key={patient._id} 
                    className="bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-6">
                      {/* Patient Avatar & Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg truncate">
                            {patient.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {patient._id?.slice(-6) || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="space-y-3 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Age
                          </span>
                          <span className="font-semibold text-gray-800">{patient.age || 'N/A'} years</span>
                        </div>
                        
                        {patient.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              Email
                            </span>
                            <span className="text-sm text-gray-800 truncate max-w-[150px]" title={patient.email}>
                              {patient.email}
                            </span>
                          </div>
                        )}
                        
                        {patient.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              Phone
                            </span>
                            <span className="text-sm text-gray-800">{patient.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => onViewDetails(patient)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                      >
                        <Stethoscope className="w-4 h-4" />
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Patients Yet</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    You don't have any registered patients at the moment. New patients will appear here.
                  </p>
                </div>
              </div>
            )}
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