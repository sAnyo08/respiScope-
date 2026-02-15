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
import Navbar from "../../utils/Navbar"
import { createConsultation, getPatientConsultations } from "../../../services/api/consultationService"

const PatientDashboard = () => {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Home")
  const navigate = useNavigate()

  const handleLogout = () => navigate("/")
  const { role } = useContext(AuthContext);

  const tabs = [
    { name: "Home", icon: <Home className="w-4 h-4" /> },
    { name: "Record", icon: <Mic className="w-4 h-4" /> },
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
        userType="patient"
        userName={user?.name || "Patient"}
        userCode={user?.code || user?._id?.slice(-6) || "PAT123"}
      />

      {/* Navigation */}
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
        {activeTab === "Home" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Consultations */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="bg-white rounded-xl p-6 h-full border-2 border-green-200 group-hover:border-green-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-green-100 rounded-full">
                      <span className="text-xs font-semibold text-green-700">Total</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Consultations</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{consultations.length}</p>
                    <p className="text-sm text-gray-500">
                      {consultations.filter(c => c.status?.toLowerCase() === 'pending').length} pending
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Doctors */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="bg-white rounded-xl p-6 h-full border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <UserCheck className="w-7 h-7 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-blue-100 rounded-full">
                      <span className="text-xs font-semibold text-blue-700">Active</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Available Doctors</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{doctors.length}</p>
                    <p className="text-sm text-gray-500">Ready for consultation</p>
                  </div>
                </div>
              </div>

              {/* Last Checkup */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="bg-white rounded-xl p-6 h-full border-2 border-orange-200 group-hover:border-orange-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-orange-100 rounded-full">
                      <span className="text-xs font-semibold text-orange-700">Recent</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Last Checkup</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {consultations.length > 0 ? new Date(consultations[0]?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {consultations.length > 0 ? 'Latest consultation' : 'No consultations yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Consultations Section */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    Recent Consultations
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your latest medical consultations
                  </p>
                </div>
                {consultations.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("History")}
                    className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
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
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Doctor Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Doctor Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            Dr. {c.doctorId?.name || 'Unknown Doctor'}
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
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                          {c.status || 'Pending'}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleOpenChat(c)}
                        className="ml-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 group-hover:shadow-md transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <MessageSquare className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Consultations Yet</h3>
                  <p className="text-gray-600 text-center max-w-md mb-4">
                    Start your first consultation with one of our available doctors.
                  </p>
                  <Button
                    onClick={() => setActiveTab("Doctors")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Browse Doctors
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">Find a Doctor</h3>
                </div>
                <p className="text-gray-600 mb-4">Browse our available doctors and start a consultation</p>
                <Button
                  onClick={() => setActiveTab("Doctors")}
                  className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                >
                  View Doctors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">Consultation History</h3>
                </div>
                <p className="text-gray-600 mb-4">View all your past and ongoing consultations</p>
                <Button
                  onClick={() => setActiveTab("History")}
                  className="w-full bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-300"
                >
                  View History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Record" && (
          <div className="bg-mint-500 rounded-2xl shadow-lg border border-mint-700 p-6 hover:shadow-xl transition-shadow">
            <PatientPortal />
          </div>
        )}

        {activeTab === "Profile" && (
          <PatientProfile />
        )}

        {activeTab === "History" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Consultation History</h2>
                  <p className="text-gray-600 mt-1">Track all your medical consultations</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">{consultations.length} Total</span>
                </div>
              </div>
            </div>

            {/* Consultations Grid */}
            {consultations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.map((c) => (
                  <Card 
                    key={c._id} 
                    className="bg-white border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                          {c.status || 'Pending'}
                        </span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Doctor Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
                            <Stethoscope className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              Dr. {c.doctorId?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {c.doctorId?.specialization || 'General Physician'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span>ID: {c._id?.slice(-8) || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleOpenChat(c)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
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
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Consultation History</h3>
                  <p className="text-gray-600 text-center max-w-md mb-4">
                    You haven't had any consultations yet. Start your first consultation with one of our doctors.
                  </p>
                  <Button
                    onClick={() => setActiveTab("Doctors")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Browse Doctors
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Doctors" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Available Doctors</h2>
                  <p className="text-gray-600 mt-1">Connect with our experienced medical professionals</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">{doctors.length} Doctors</span>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <Card 
                    key={doctor._id} 
                    className="bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-6">
                      {/* Doctor Avatar & Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                          <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg truncate">
                            Dr. {doctor.name || 'Unknown Doctor'}
                          </h3>
                          <p className="text-sm text-purple-600 font-medium">
                            {doctor.specialization || 'General Physician'}
                          </p>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-3 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            Experience
                          </span>
                          <span className="font-semibold text-gray-800">
                            {doctor.experience || 'N/A'} years
                          </span>
                        </div>
                        
                        {doctor.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              Email
                            </span>
                            <span className="text-sm text-gray-800 truncate max-w-[150px]" title={doctor.email}>
                              {doctor.email}
                            </span>
                          </div>
                        )}
                        
                        {doctor.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              Phone
                            </span>
                            <span className="text-sm text-gray-800">{doctor.phone}</span>
                          </div>
                        )}

                        {doctor.qualification && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              Degree
                            </span>
                            <span className="text-sm text-gray-800 font-medium">{doctor.qualification}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleConsult(doctor._id)}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Consult Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctors Available</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    There are currently no doctors available. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default PatientDashboard