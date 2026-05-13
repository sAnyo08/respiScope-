"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { Home, User, Users, Clock, Activity, UserCheck, Calendar, Stethoscope, MessageSquare, ArrowRight, Phone, Mail, Award, Briefcase, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "../../ui/Button"
import { Card, CardContent } from "../../ui/Card"
import { getDoctors } from "../../../services/api/doctorService"
import PatientProfile from "../../utils/PatientProfile"
import AuscultationGuide from "../../utils/AuscultationGuide"
import Navbar from "../../utils/Navbar"
import { createConsultation, getPatientConsultations } from "../../../services/api/consultationService"
import { motion, AnimatePresence } from "framer-motion"
import DataTable from "../../ui/DataTable"
import { X, Clipboard, ShieldCheck, AlertCircle } from "lucide-react"
import api from "../../../services/api/api"

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Home")
  const navigate = useNavigate()
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [audioMessages, setAudioMessages] = useState([]);

  const handleViewReview = async (consultationId) => {
    try {
      const reviewRes = await api.get(`/reviews/consultation/${consultationId}`);
      const consultationRes = await api.get(`/consultations/${consultationId}`);
      setSelectedReview(reviewRes.data);
      setSelectedConsultation(consultationRes.data);
      
      // Fetch shared audio messages (chat/IoT)
      try {
        const audioRes = await api.get(`/messages/consultation/${consultationId}/audio`);
        setAudioMessages(audioRes.data);
      } catch (err) {
        console.error("Failed to fetch audio messages", err);
        setAudioMessages([]);
      }

      setIsReviewModalOpen(true);
    } catch (err) {
      console.error("Error fetching review", err);
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm("Delete this consultation history? This will remove all recordings and messages.")) return;
    try {
      await api.delete(`/consultations/${id}`);
      setConsultations(prev => prev.filter(c => c._id !== id));
      alert("Consultation deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete consultation");
    }
  };

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
      case 'recording':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed':
      case 'reviewed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'submitted':
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
                  <p className="text-teal-100/60 mt-1">Track and manage your medical records</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30 text-green-300">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{consultations.length} Sessions</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {Object.entries(
                consultations.reduce((acc, c) => {
                  const docId = c.doctorId?._id || 'unknown';
                  if (!acc[docId]) acc[docId] = { doctor: c.doctorId, sessions: [] };
                  acc[docId].sessions.push(c);
                  return acc;
                }, {})
              ).map(([docId, group]) => (
                <DoctorConsultationGroup 
                  key={docId} 
                  group={group} 
                  handleOpenChat={handleOpenChat}
                  handleViewReview={handleViewReview}
                  handleDeleteConsultation={handleDeleteConsultation}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------- REVIEW MODAL ---------- */}
        <AnimatePresence>
          {isReviewModalOpen && selectedReview && selectedConsultation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0b2b22] border border-teal-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.2)]"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-teal-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Medical Assessment Report</h3>
                      <p className="text-xs text-teal-100/40 tracking-widest uppercase">Consultation #{selectedConsultation._id.slice(-6)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsReviewModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full text-teal-100/40 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter">Condition Severity</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                          selectedReview.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          selectedReview.severity === 'moderate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {selectedReview.severity?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter">Review Date</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-400" />
                        {new Date(selectedReview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter">Doctor</p>
                      <p className="text-white font-medium">Dr. {selectedConsultation.doctorId?.name || "Attending Physician"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Notes & Recommendations */}
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter flex items-center gap-2">
                          <Clipboard className="w-3 h-3 text-teal-400" /> Clinical Diagnosis
                        </p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-teal-50 italic">
                          "{selectedReview.diagnosis}"
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-teal-400" /> Doctor's Recommendations
                        </p>
                        <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-100 leading-relaxed text-sm">
                          {selectedReview.comments}
                        </div>
                      </div>

                      {selectedConsultation.notes && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter">Your Shared Notes</p>
                          <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-teal-100/60 text-sm">
                            {selectedConsultation.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Recording Points Summary */}
                    <div className="space-y-4">
                      <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter flex items-center gap-2">
                        <Activity className="w-3 h-3 text-teal-400" /> Session Recordings
                      </p>
                      <div className="space-y-3">
                        {selectedConsultation.recordingPoints && selectedConsultation.recordingPoints.length > 0 ? (
                          selectedConsultation.recordingPoints.map((point, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 group hover:border-teal-500/30 transition-all">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-white capitalize">{point.pointName.replace(/_/g, ' ')}</p>
                                    <p className="text-[9px] text-teal-100/40 uppercase">{point.duration}s Recording</p>
                                  </div>
                                </div>
                                <div className="p-2 rounded-full bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                                  <Activity className="w-3 h-3" />
                                </div>
                              </div>
                              
                              {(point.filteredFileId || point.fileId || point.audioUrl) && (
                                <audio 
                                  controls 
                                  src={point.filteredFileId || point.fileId ? 
                                    `${api.defaults.baseURL}/messages/file/public/${point.filteredFileId || point.fileId}` : 
                                    point.audioUrl
                                  } 
                                  className="w-full h-8 custom-audio-player"
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-teal-100/30 italic">No point-by-point recording data available.</p>
                        )}
                      </div>
                      
                      {selectedReview.notes && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter mb-2">Internal Clinical Notes</p>
                          <p className="text-teal-100/50 text-xs bg-black/40 p-3 rounded-lg border border-white/5">
                            {selectedReview.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SHARED RECORDINGS SECTION FOR PATIENTS */}
                  {audioMessages.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                      <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-tighter flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-purple-400" /> Additional Shared Recordings
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {audioMessages.map((msg) => (
                          <div key={msg._id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-bold text-teal-50">Shared Recording</p>
                              <p className="text-[9px] text-teal-100/30 uppercase">{new Date(msg.createdAt).toLocaleDateString()}</p>
                            </div>
                            <audio 
                              controls 
                              src={`${api.defaults.baseURL}/messages/file/public/${msg.fileId}`} 
                              className="w-full h-8 custom-audio-player"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 flex justify-end">
                  <Button onClick={() => setIsReviewModalOpen(false)} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-12 rounded-full">
                    Close Report
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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

            <DataTable 
              pageSize={10}
              columns={[
                { 
                  header: "Doctor", 
                  render: (doc) => (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="font-bold">Dr. {doc.name || 'Unknown'}</p>
                    </div>
                  )
                },
                { 
                  header: "Specialty", 
                  render: (doc) => (
                    <span className="text-purple-300/80 font-medium">{doc.specialization || 'General Physician'}</span>
                  )
                },
                { 
                  header: "Experience", 
                  render: (doc) => (
                    <span className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-amber-400" />
                      {doc.experience || 'N/A'} years
                    </span>
                  )
                },
                { 
                  header: "Actions", 
                  render: (doc) => (
                    <Button 
                      size="sm"
                      onClick={() => handleConsult(doc._id)} 
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white h-8 text-xs border-transparent shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    >
                      Consult Now
                    </Button>
                  )
                }
              ]}
              data={doctors}
            />
          </motion.div>
        )}
      </main>
    </div>
  )
}

const DoctorConsultationGroup = ({ group, handleOpenChat, handleViewReview, handleDeleteConsultation, getStatusColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 group hover:border-teal-500/30 transition-all duration-300">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Dr. {group.doctor?.name || 'Unknown Doctor'}</h3>
            <p className="text-sm text-teal-100/40">{group.doctor?.specialization || 'Physician'} • {group.sessions.length} Sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-teal-100/40">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-4 pt-0 space-y-3">
              {group.sessions.map((session) => (
                <div 
                  key={session._id}
                  className="flex flex-col md:flex-row items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-teal-500/30 transition-all group/item gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-teal-500/5 rounded-lg border border-teal-500/10">
                      <Calendar className="w-4 h-4 text-teal-400/60" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">#{session._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-teal-100/40">{new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md uppercase tracking-tighter ${getStatusColor(session.status)}`}>
                      {session.status || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenChat(session)} 
                      className="flex-1 md:flex-none h-9 text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-100 border-teal-500/30"
                    >
                      <MessageSquare className="w-3 h-3 mr-2" />
                      Chat
                    </Button>
                    {session.status === 'reviewed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 md:flex-none h-9 text-xs border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleViewReview(session._id)}
                      >
                        Review
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteConsultation(session._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PatientDashboard