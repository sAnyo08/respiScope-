"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import PatientCard from "../../utils/PatientCard"
import { Home, Mic, User, Users, Clock, LogOut, Activity, UserCheck, Calendar, Stethoscope, MessageSquare, ArrowRight, Phone, Mail, Award, Briefcase } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardTitle, CardHeader } from "../../ui/Card"
import History from "../../utils/History"
import PatientPortal from "../../utils/record/Record"
import PaitentDoctors from "../../utils/patientDoctors"
import { getDoctors } from "../../../services/api/doctorService"
import { DoctorCard } from "../../utils/DoctorCard"
import PatientProfile from "../../utils/PatientProfile"
import AuscultationGuide from "../../utils/AuscultationGuide"
import Navbar from "../../utils/Navbar"
import { createConsultation, getPatientConsultations } from "../../../services/api/consultationService"
import { motion } from "framer-motion"

const PatientDashboard = () => {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Home")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")
  const { role } = useContext(AuthContext);

  const tabs = [
    { name: "Home", icon: <Home className="w-4 h-4" /> },
    { name: "Guide", icon: <Activity className="w-4 h-4" /> },
    { name: "Doctors", icon: <Users className="w-4 h-4" /> },
    { name: "History", icon: <Clock className="w-4 h-4" /> },
    { name: "Profile", icon: <User className="w-4 h-4" /> },
  ]

  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load patients", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getPatientConsultations();
        setConsultations(data);
      } catch (error) {
        console.error("Failed to load patients", error);
      }
    };

    fetchConsultations();
  }, []);

  // Handle Consult Now button click
  const handleConsult = async (doctorId) => {

    console.log("ROLE:", role);

    if (!role) {
      alert("Session expired. Please login again.");
      navigate("/patient-login");
      return;
    }

    if (role !== "patient") {
      alert("Only patients can start a consultation");
      return;
    }

    try {
      // ✅ Add debug logging
      console.log("Attempting to create consultation for doctor:", doctorId);


      const consultation = await createConsultation(doctorId);
      console.log("Consultation created successfully:", consultation);

      navigate(`/message/${consultation._id}`, { state: { doctorId } });

    } catch (error) {
      console.error("Failed to initiate consultation", error);
      // ✅ Add user-friendly error message
      alert(`Failed to create consultation: ${error.message}`);
    }
  };

  const handleOpenChat = async(c) => {
    console.log("Opening chat for consultation:", c._id);

    try {
      navigate(`/message/${c._id}`, { state: { consultationId: c._id } });
    } catch (error) {
      console.error("Failed to open consultation", error.message);
      // ✅ Add user-friendly error message
      alert(`Failed to open consultation: ${error.message}`);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
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
        userType="patient"
        userName={user?.name || "Patient"}
        userCode={user?.code || user?._id?.slice(-6) || "PAT123"}
      />

      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={activeTab === tab.name ? "default" : "ghost"}
              className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.name 
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
      <main className={`mx-auto px-6 py-8 space-y-8 relative z-10 ${activeTab === "Guide" ? "w-full" : "max-w-7xl"}`}>
        {activeTab === "Home" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Consultations */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                      <Activity className="w-7 h-7 text-green-400" />
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-xs font-semibold text-green-300">Total</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Total Consultations</p>
                    <p className="text-4xl font-bold text-white mb-2">{consultations.length}</p>
                    <p className="text-sm text-teal-100/40">
                      {consultations.filter(c => c.status?.toLowerCase() === 'pending').length} pending
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Available Doctors */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
                      <UserCheck className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                      <span className="text-xs font-semibold text-blue-300">Active</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Available Doctors</p>
                    <p className="text-4xl font-bold text-white mb-2">{doctors.length}</p>
                    <p className="text-sm text-teal-100/40">Ready for consultation</p>
                  </div>
                </CardContent>
              </Card>

              {/* Last Checkup */}
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform">
                      <Calendar className="w-7 h-7 text-orange-400" />
                    </div>
                    <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
                      <span className="text-xs font-semibold text-orange-300">Recent</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100/60 mb-1">Last Checkup</p>
                    <p className="text-4xl font-bold text-white mb-2">
                       {consultations.length > 0 ? new Date(consultations[0]?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                    </p>
                    <p className="text-sm text-teal-100/40">
                      {consultations.length > 0 ? 'Latest consultation' : 'No consultations yet'}
                    </p>
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
                      Your latest medical consultations
                    </p>
                  </div>
                  {consultations.length > 0 && (
                    <Button
                      onClick={() => setActiveTab("History")}
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
                          {/* Doctor Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="w-6 h-6 text-green-300" />
                          </div>
                          
                          {/* Doctor Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              Dr. {c.doctorId?.name || 'Unknown Doctor'}
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

                        {/* Action Button */}
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
                    <p className="text-teal-100/60 text-center max-w-md mb-4">
                      Start your first consultation with one of our available doctors.
                    </p>
                    <Button
                      onClick={() => setActiveTab("Doctors")}
                      variant="default"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Browse Doctors
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 hover:bg-white/5 transition-colors duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white text-lg">Find a Doctor</h3>
                    </div>
                    <p className="text-teal-100/60 mb-4">Browse our available doctors and start a consultation today.</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("Doctors")}
                    variant="outline"
                  >
                    View Doctors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 hover:bg-white/5 transition-colors duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-teal-400" />
                      </div>
                      <h3 className="font-semibold text-white text-lg">Consultation History</h3>
                    </div>
                    <p className="text-teal-100/60 mb-4">View all your past diagnoses, records, and ongoing consultations.</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("History")}
                    variant="outline"
                  >
                    View History
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* {activeTab === "Record" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl shadow-lg border border-teal-500/30 p-6 bg-teal-500/5 backdrop-blur-md">
            <PatientPortal />
          </motion.div>
        )} */}

        {activeTab === "Guide" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <AuscultationGuide />
          </motion.div>
        )}

        {activeTab === "Profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PatientProfile />
          </motion.div>
        )}

        {activeTab === "History" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Consultation History</h2>
                  <p className="text-teal-100/60 mt-1">Track all your medical consultations</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30 text-green-300">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{consultations.length} Total</span>
                </div>
              </CardContent>
            </Card>

            {/* Consultations Grid */}
            {consultations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.map((c) => (
                  <Card key={c._id} className="group hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getStatusColor(c.status)}`}>
                          {c.status || 'Pending'}
                        </span>
                        <Calendar className="w-4 h-4 text-teal-100/40" />
                      </div>

                      {/* Doctor Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center shadow-md">
                            <Stethoscope className="w-6 h-6 text-green-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg truncate">
                              Dr. {c.doctorId?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-sm text-teal-100/60 truncate">
                              {c.doctorId?.specialization || 'General Physician'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-white/10 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-teal-100/80">
                          <Clock className="w-4 h-4 opacity-70" />
                          <span>Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-teal-100/80">
                          <Activity className="w-4 h-4 opacity-70" />
                          <span>ID: {c._id?.slice(-8) || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button onClick={() => handleOpenChat(c)} className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <Clock className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Consultation History</h3>
                  <p className="text-teal-100/60 max-w-md mb-4">
                    You haven't had any consultations yet. Start your first consultation with one of our doctors.
                  </p>
                  <Button onClick={() => setActiveTab("Doctors")}>
                    <Users className="w-4 h-4 mr-2" />
                    Browse Doctors
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === "Doctors" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Available Doctors</h2>
                  <p className="text-teal-100/60 mt-1">Connect with our experienced medical professionals</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/30 text-purple-300">
                  <Stethoscope className="w-5 h-5" />
                  <span className="font-semibold">{doctors.length} Doctors</span>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <Card key={doctor._id} className="group hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Doctor Avatar & Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)] flex-shrink-0">
                          <Stethoscope className="w-8 h-8 text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">
                            Dr. {doctor.name || 'Unknown Doctor'}
                          </h3>
                          <p className="text-sm text-purple-300 font-medium">
                            {doctor.specialization || 'General Physician'}
                          </p>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-3 mb-6 pt-4 border-t border-white/10 flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-teal-100/60 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Experience
                          </span>
                          <span className="font-semibold text-white">
                            {doctor.experience || 'N/A'} years
                          </span>
                        </div>
                        
                        {doctor.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-100/60 flex items-center gap-2">
                              <Mail className="w-4 h-4" /> Email
                            </span>
                            <span className="text-sm text-white truncate max-w-[150px]" title={doctor.email}>
                              {doctor.email}
                            </span>
                          </div>
                        )}
                        
                        {doctor.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-100/60 flex items-center gap-2">
                              <Phone className="w-4 h-4" /> Phone
                            </span>
                            <span className="text-sm text-white">{doctor.phone}</span>
                          </div>
                        )}

                        {doctor.qualification && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-100/60 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> Degree
                            </span>
                            <span className="text-sm text-white font-medium">{doctor.qualification}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button onClick={() => handleConsult(doctor._id)} className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] border-transparent mt-auto">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Consult Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full border border-purple-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <Stethoscope className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Doctors Available</h3>
                  <p className="text-teal-100/60 max-w-md">
                    There are currently no doctors available. Please check back later.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default PatientDashboard