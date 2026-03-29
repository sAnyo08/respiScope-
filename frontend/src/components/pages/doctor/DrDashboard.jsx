"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope, UserPlus, UserPen, ClipboardClock, CalendarCheck, MessageSquare, ArrowRight, Phone, Mail } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardTitle, CardHeader } from "../../ui/Card"
import { AuthContext } from "../../../context/authContext.js"
import { getPatients } from "../../../services/api/patientService.js"
import { getDoctorConsultations, getConsultationsMessages } from "../../../services/api/consultationService.js"
import DoctorProfile from "../../../components/utils/doctorProfile"
import Navbar from "../../utils/Navbar"
import { motion } from "framer-motion"

const DoctorDashboard = () => {
  const { user, login } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Dashboard")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")

  const tabs = [
    { name: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { name: "Consultations", icon: <UserCheck className="w-4 h-4" /> },
    // { name: "Patients", icon: <Users className="w-4 h-4" /> },
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

  const handleOpenChat = async (c) => {
    console.log("Opening chat for consultation:", c._id);

    try {
      navigate(`/message/${c._id}`, { state: { consultationId: c._id } });
    } catch (error) {
      console.error("Failed to open consultation", error.message);
      alert(`Failed to open consultation: ${error.message}`);
    }
  };

  const onViewDetails = async (patient) => {
    try {
      navigate(`/patients/${patient._id}`);
    } catch (error) {
      console.error("Failed to open patient details", error.message);
      alert(`Failed to open patient details: ${error.message}`);
    }
  };

  // Helper function to get status badge color - updated for dark glass theme
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a] text-teal-50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <Navbar
        userType="doctor"
        userName={`Dr. ${user?.name || "Doctor"}`}
        userCode={user?.code || user?._id?.slice(-6) || "DOC123"}
      />

      <nav className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={activeTab === tab.name ? "default" : "ghost"}
              className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${activeTab === tab.name
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)] border-transparent"
                  : "text-teal-100/60 hover:text-white hover:bg-white/10"
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
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {activeTab === "Dashboard" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Patients */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                      <span className="text-xs font-semibold text-blue-300">Active</span>
                    </div>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-teal-100/60 mb-1">Total Patients</p>
                     <p className="text-4xl font-bold text-white mb-2">{consultations.length}</p>
                     <p className="text-sm text-teal-100/40">Consulted patients</p>
                  </div>
                </CardContent>
              </Card>

              {/* Total Consultations */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-emerald-600/20 border border-teal-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:scale-110 transition-transform">
                      <UserCheck className="w-7 h-7 text-teal-400" />
                    </div>
                    <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full">
                      <span className="text-xs font-semibold text-teal-300">All Time</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Consultations</p>
                    <p className="text-4xl font-bold text-white mb-2">{consultations.length}</p>
                    <p className="text-sm text-teal-100/40">Total consultations</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Consultations */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                      <ClipboardClock className="w-7 h-7 text-amber-400" />
                    </div>
                    <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                      <span className="text-xs font-semibold text-amber-300">Urgent</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Pending</p>
                    <p className="text-4xl font-bold text-white mb-2">
                      {consultations.filter(c => c.status?.toLowerCase() === 'pending').length}
                    </p>
                    <p className="text-sm text-teal-100/40">Awaiting review</p>
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-fuchsia-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                      <CalendarCheck className="w-7 h-7 text-purple-400" />
                    </div>
                    <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                      <span className="text-xs font-semibold text-purple-300">Career</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Experience</p>
                    <p className="text-4xl font-bold text-white mb-2">
                       {user?.experience || 12}
                    </p>
                    <p className="text-sm text-teal-100/40">Years of practice</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Consultations Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-teal-400" />
                      Recent Consultations
                    </h2>
                    <p className="text-sm text-teal-100/60 mt-1">
                      Latest patient consultations requiring your attention
                    </p>
                  </div>
                  {consultations.length > 0 && (
                    <Button
                      onClick={() => setActiveTab("Consultations")}
                      variant="outline"
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
                        className="flex flex-col md:flex-row items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 group gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1 w-full relative">
                          {/* Patient Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-emerald-600/20 border border-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-teal-300" />
                          </div>

                          {/* Patient Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              {c.patientId?.name || 'Unknown Patient'}
                            </h3>
                            <p className="text-sm text-teal-100/60">
                              {new Date(c.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className={`px-3 py-1 justify-self-end rounded-full text-xs font-semibold border backdrop-blur-md ${getStatusColor(c.status)}`}>
                            {c.status || 'Pending'}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex w-full md:w-auto gap-2">
                          <Button
                            onClick={() => handleOpenChat(c)}
                            variant="default"
                            className="w-full md:w-auto"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                      <MessageSquare className="w-10 h-10 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Consultations Yet</h3>
                    <p className="text-teal-100/60 text-center max-w-md">
                      You don't have any consultations at the moment. New consultations will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Patients Today */}
              <Card>
                <CardContent className="p-5 hover:bg-white/5 transition-colors duration-300 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white">Active Today</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">{consultations.length}</p>
                  <p className="text-sm text-teal-100/60 mt-1">Total active patients</p>
                </CardContent>
              </Card>

              {/* Completed Consultations */}
              <Card>
                <CardContent className="p-5 hover:bg-white/5 transition-colors duration-300 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-semibold text-white">Completed</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {consultations.filter(c => c.status?.toLowerCase() === 'completed').length}
                  </p>
                  <p className="text-sm text-teal-100/60 mt-1">Successfully completed</p>
                </CardContent>
              </Card>

              {/* Average Response Time */}
              <Card>
                <CardContent className="p-5 hover:bg-white/5 transition-colors duration-300 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white">Response Time</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">~2h</p>
                  <p className="text-sm text-teal-100/60 mt-1">Average response</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "Consultations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Consultations</h2>
                   <p className="text-teal-100/60 mt-1">Manage and track all patient consultations</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/30 text-teal-300">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{consultations.length} Active</span>
                </div>
              </CardContent>
            </Card>

            {/* Consultations Grid */}
            {consultations.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.map((c) => (
                  <Card key={c._id} className="group hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getStatusColor(c.status)}`}>
                          {c.status || 'Pending'}
                        </span>
                        <Calendar className="w-4 h-4 text-teal-100/40" />
                      </div>

                      {/* Patient Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-emerald-600/20 border border-teal-500/30 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-teal-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg truncate">
                              {c.patientId?.name || 'Unknown Patient'}
                            </h3>
                            <p className="text-sm text-teal-100/60 truncate">ID: {c.patientId?._id?.slice(-6) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-white/10 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-teal-100/80">
                          <Clock className="w-4 h-4 opacity-70" />
                          <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <Button onClick={() => handleOpenChat(c)} className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Open Chat
                        </Button>
                        <Button onClick={() => onViewDetails(c.patientId)} variant="secondary" className="w-full">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-teal-500/10 rounded-full border border-teal-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                    <MessageSquare className="w-10 h-10 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Consultations Yet</h3>
                  <p className="text-teal-100/60 max-w-md">
                    You don't have any active consultations at the moment. New consultations will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* {activeTab === "Patients" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Patients</h2>
                  <p className="text-teal-100/60 mt-1">View and manage your patient records</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-blue-300">{patients.length} Patients</span>
                </div>
              </CardContent>
            </Card>

            {patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <Card key={patient._id} className="group hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] flex-shrink-0">
                          <User className="w-8 h-8 text-blue-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">
                            {patient.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-sm text-teal-100/60">ID: {patient._id?.slice(-6) || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-teal-100/60 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Age
                          </span>
                          <span className="font-semibold text-white">{patient.age || 'N/A'} years</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-100/60 flex items-center gap-2">
                              <Mail className="w-4 h-4" /> Email
                            </span>
                            <span className="text-sm text-white truncate max-w-[150px]" title={patient.email}>
                              {patient.email}
                            </span>
                          </div>
                        )}
                        {patient.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-100/60 flex items-center gap-2">
                              <Phone className="w-4 h-4" /> Phone
                            </span>
                            <span className="text-sm text-white">{patient.phone}</span>
                          </div>
                        )}
                      </div>

                      <Button onClick={() => onViewDetails(patient)} className="w-full">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Patients Yet</h3>
                  <p className="text-teal-100/60 max-w-md">
                    You don't have any registered patients at the moment. New patients will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )} */}

        {activeTab === "Profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DoctorProfile />
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard