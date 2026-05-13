import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AudioWaveform from "../../ui/AudioWaveform";
import LiveAudioStream from "../../ui/LiveAudioStream";
import AIAnalysisCard from "../../ui/AIAnalysisCard";
import { Activity, Trash2, ChevronLeft, ChevronRight, User, Calendar, Stethoscope, Clock, FileText, ShieldCheck, Settings2, MessageSquare, Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import api from "../../../services/api/api";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../ui/Toast";
import { API_URL as BASE_API_URL } from "../../../config";
import DataTable from "../../ui/DataTable";

const PatientDetails = () => {
  const { toasts, addToast, removeToast } = useToast();
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [recordingPoints, setRecordingPoints] = useState([]);
  const [audioMessages, setAudioMessages] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /* ---------------- FETCH PATIENT ---------------- */
  useEffect(() => {
    api.get(`/patients/${patientId}`)
      .then((res) => setPatient(res.data))
      .catch(err => console.error("Error fetching patient", err));
  }, [patientId]);

  /* ---------------- FETCH CONSULTATIONS ---------------- */
  useEffect(() => {
    api.get(`/consultations/doctor/patient/${patientId}`)
      .then((res) => setConsultations(res.data))
      .catch(err => console.error("Error fetching consultations", err));
  }, [patientId]);

  /* ---------------- FETCH DETAILS & REVIEW ---------------- */
  useEffect(() => {
    if (!selectedConsultation) {
      setSelectedReview(null);
      setRecordingPoints([]);
      setAudioMessages([]);
      return;
    }

    // Fetch Consultation details (includes recording points)
    api.get(`/consultations/${selectedConsultation._id}`)
      .then((res) => {
        setRecordingPoints(res.data.recordingPoints || []);
      })
      .catch(err => console.error("Error fetching consultation points", err));

    // Fetch Review if reviewed
    if (selectedConsultation.status === 'reviewed') {
      api.get(`/reviews/consultation/${selectedConsultation._id}`)
        .then((res) => setSelectedReview(res.data))
        .catch(err => console.error("Error fetching review", err));
    } else {
      setSelectedReview(null);
    }

    // Still fetch audio messages for legacy support/chat sync
    api.get(`/messages/consultation/${selectedConsultation._id}/audio`)
      .then((res) => setAudioMessages(res.data))
      .catch(err => console.error("Error fetching audio messages", err));
  }, [selectedConsultation]);

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setAudioMessages(prev => prev.filter(m => m._id !== id));
      addToast("Recording deleted", "success");
    } catch (err) {
      console.error(err);
      addToast("Delete failed", "error");
    }
  };

  const handleProcessAudio = async (pointId) => {
    try {
      await api.post(`/audio/process-point/${pointId}`);
      addToast("DSP Filtering complete", "success");
      
      // Refresh points
      const res = await api.get(`/consultations/${selectedConsultation._id}`);
      setRecordingPoints(res.data.recordingPoints);
    } catch (err) {
      console.error("DSP processing failed", err);
      addToast("Failed to start DSP processing", "error");
    }
  };

  const handleAIAnalyze = async (pointId) => {
    try {
      await api.post(`/audio/ai-analyze-point/${pointId}`);
      addToast("AI Diagnostic analysis complete", "success");
      
      // Refresh points
      const res = await api.get(`/consultations/${selectedConsultation._id}`);
      setRecordingPoints(res.data.recordingPoints);
    } catch (err) {
      console.error("AI Analysis failed", err);
      addToast("Failed to initiate AI Analysis", "error");
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entire consultation session? This action cannot be undone.")) return;
    try {
      await api.delete(`/consultations/${id}`);
      setConsultations(prev => prev.filter(c => c._id !== id));
      if (selectedConsultation?._id === id) {
        setSelectedConsultation(null);
      }
      addToast("Consultation deleted successfully", "success");
    } catch (err) {
      console.error("Delete consultation failed", err);
      addToast("Failed to delete consultation", "error");
    }
  };

  const processAudio = async (messageId) => {
    try {
      const res = await api.post(`/audio/process/${messageId}`);
      if (res.data && res.data.data) {
        setAudioMessages(prev => prev.map(m => m._id === messageId ? res.data.data : m));
      }
      addToast("Filter applied successfully!", "success");
    } catch (err) {
      console.error("Error processing audio", err);
      addToast("Failed to process audio: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const runAIAnalysis = async (messageId) => {
    try {
      setAudioMessages(prev => prev.map(m => m._id === messageId ? { ...m, aiAnalysis: { status: 'pending' } } : m));
      const res = await api.post(`/audio/ai-analyze/${messageId}`);
      
      if (res.data?.results) {
        setAudioMessages(prev => prev.map(m => 
          m._id === messageId ? res.data.results : m
        ));
      } else {
        api.get(`/messages/consultation/${selectedConsultation._id}/audio`)
          .then((res) => setAudioMessages(res.data));
      }
    } catch (err) {
      console.error("Error triggering AI", err);
      alert("AI Analysis failed: " + (err.response?.data?.error || err.message));
      setAudioMessages(prev => prev.map(m => m._id === messageId ? { ...m, aiAnalysis: { status: 'failed' } } : m));
    }
  };

  const FILE_BASE_URL = BASE_API_URL.replace("/api", "/api/messages/file/public");

  const getStatusColor = (status) => {
    switch (status) {
      case "recording": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "submitted": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "reviewed": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* ---------- SIDEBAR ---------- */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} bg-white/5 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ease-in-out flex flex-col relative overflow-hidden z-20`}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-4 top-6 p-2 bg-teal-500/10 hover:bg-teal-500/20 rounded-lg border border-teal-500/30 text-teal-400 transition-all z-30"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="p-6 pt-16 h-full overflow-y-auto custom-scrollbar">
          {!isSidebarCollapsed && (
            <>
              {patient && (
                <div className="mb-8 p-4 bg-teal-500/5 rounded-2xl border border-teal-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-teal-50">{patient.name}</h2>
                      <p className="text-xs text-teal-200/50">Patient Record</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100/40">Age</span>
                      <span className="text-teal-100 font-medium">{patient.age}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100/40">Phone</span>
                      <span className="text-teal-100 font-medium">{patient.phone}</span>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="mb-4 font-bold text-teal-400 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Activity className="w-3 h-3" /> Quick Access
              </h3>

              <div className="space-y-3">
                {consultations.slice(0, 10).map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setSelectedConsultation(c)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${selectedConsultation?._id === c._id
                      ? "bg-teal-500/20 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-bold ${selectedConsultation?._id === c._id ? "text-teal-100" : "text-gray-300 group-hover:text-white"}`}>
                        #{c._id.slice(-6)}
                      </p>
                      <span className={`w-2 h-2 rounded-full ${c.status === 'reviewed' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    </div>
                    <p className="text-[10px] text-teal-200/40 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {isSidebarCollapsed && (
            <div className="flex flex-col items-center gap-6 mt-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-200/40" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

        {!selectedConsultation ? (
          <div className="space-y-8 relative z-10">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Patient Overview</h1>
                <p className="text-teal-100/60 mt-1">Review clinical history and recordings</p>
              </div>
            </header>

            <Card className="border-teal-500/20 bg-teal-500/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  All Consultations
                </h3>
                <DataTable 
                  pageSize={8}
                  columns={[
                    { 
                      header: "Session ID", 
                      render: (c) => <span className="font-mono text-teal-300">#{c._id.slice(-8)}</span> 
                    },
                    { 
                      header: "Date", 
                      render: (c) => (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-40" />
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      )
                    },
                    { 
                      header: "Status", 
                      render: (c) => (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md uppercase tracking-widest ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      )
                    },
                    { 
                      header: "Actions", 
                      render: (c) => (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => setSelectedConsultation(c)} className="h-8 text-xs">
                            Open Details
                          </Button>
                          {c.status === 'submitted' && (
                            <Button 
                              size="sm" 
                              className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white"
                              onClick={() => navigate(`/review/${c._id}`)}
                            >
                              Review Session
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDeleteConsultation(c._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={consultations}
                />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]"></div>
                  <h3 className="text-teal-400 text-sm font-bold tracking-widest">LIVE STREAMING CONSOLE</h3>
                </div>
                <div className="bg-black/60 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <LiveAudioStream />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedConsultation(null)}
                  className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-white">Consultation Details</h2>
                  <p className="text-sm text-teal-100/40">ID: #{selectedConsultation._id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-xl border backdrop-blur-xl flex items-center gap-2 ${getStatusColor(selectedConsultation.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  <span className="font-bold text-xs uppercase tracking-widest">{selectedConsultation.status}</span>
                </div>
                {selectedConsultation.status === 'submitted' && (
                  <Button 
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 font-bold"
                    onClick={() => navigate(`/review/${selectedConsultation._id}`)}
                  >
                    Start Clinical Review
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-10 px-4"
                  onClick={() => handleDeleteConsultation(selectedConsultation._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Session
                </Button>
              </div>
            </div>

            {/* PATIENT NOTES & REVIEW SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Notes */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-teal-400">
                    <FileText className="w-4 h-4" />
                    <h3 className="font-bold uppercase tracking-tighter text-xs">Patient's Observation Notes</h3>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-teal-100/70 text-sm italic">
                    {selectedConsultation.notes || "No additional notes provided by patient."}
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Review (If reviewed) */}
              {selectedReview && (
                <Card className="bg-teal-500/10 border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-teal-400">
                        <Stethoscope className="w-4 h-4" />
                        <h3 className="font-bold uppercase tracking-tighter text-xs">Your Clinical Assessment</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                        selectedReview.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        selectedReview.severity === 'moderate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {selectedReview.severity?.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-widest mb-1">Diagnosis</p>
                        <p className="text-white font-medium">{selectedReview.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-widest mb-1">Comments</p>
                        <p className="text-teal-100/80 text-sm leading-relaxed">{selectedReview.comments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RECORDINGS GRID - FULL WIDTH */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Activity className="w-6 h-6 text-teal-400" />
                  Clinical Recording Points
                </h3>
                <div className="px-4 py-2 bg-teal-500/10 rounded-xl border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-widest">
                  {recordingPoints.length} Points Captured
                </div>
              </div>

              {recordingPoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center bg-white/5 border border-white/10 rounded-3xl p-12">
                  <Activity className="w-12 h-12 text-teal-900/40 mb-4" />
                  <h3 className="text-white font-bold mb-2">No Clinical Recordings Found</h3>
                  <p className="text-teal-100/40 max-w-sm">
                    This consultation session does not have any recorded auscultation points yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {recordingPoints.map((point, index) => (
                    <Card key={point._id} className="bg-white/5 border-white/10 hover:border-teal-500/30 transition-all overflow-hidden group shadow-2xl">
                      <CardContent className="p-0 grid grid-cols-1 xl:grid-cols-12">
                        {/* Point Details & Waveform */}
                        <div className="xl:col-span-5 p-8 border-b xl:border-b-0 xl:border-r border-white/10 flex flex-col justify-between">
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-700/20 border border-teal-500/30 rounded-2xl flex items-center justify-center font-bold text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-xl capitalize">{point.pointName.replace(/_/g, ' ')}</h4>
                                  <p className="text-[10px] text-teal-100/40 uppercase tracking-[0.2em] font-bold">
                                    {point.duration}s Recording • {new Date(point.recordedAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-black/60 p-6 rounded-3xl border border-white/5 shadow-inner relative overflow-hidden">
                              <div className="absolute top-2 right-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
                                <span className="text-[8px] text-teal-100/30 font-bold uppercase tracking-widest">Digital Signal</span>
                              </div>
                              <AudioWaveform 
                                fileId={point.filteredFileId || point.fileId} 
                                peaks={point.aiAnalysis?.peaks} 
                              />
                            </div>
                          </div>

                          <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                              { (point.filteredFileId || point.fileId || point.audioUrl) ? (
                                <audio
                                  controls
                                  src={point.filteredFileId || point.fileId ? 
                                    `${BASE_API_URL}/messages/file/public/${point.filteredFileId || point.fileId}` : 
                                    point.audioUrl
                                  }
                                  className="flex-1 h-11 custom-audio-player"
                                />
                              ) : (
                                <div className="flex-1 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 text-xs font-bold">
                                  No Audio File Found
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {!point.filteredFileId ? (
                                <Button
                                  onClick={() => handleProcessAudio(point._id)}
                                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all"
                                >
                                  Run DSP Filter
                                </Button>
                              ) : (
                                <div className="h-12 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30">
                                  <ShieldCheck className="w-4 h-4 mr-2" />
                                  DSP FILTERED
                                </div>
                              )}

                              {!point.aiAnalysis || point.aiAnalysis.status !== 'completed' ? (
                                <Button
                                  onClick={() => handleAIAnalyze(point._id)}
                                  disabled={point.aiAnalysis?.status === 'pending' || !point.filteredFileId}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all"
                                >
                                  {point.aiAnalysis?.status === 'pending' ? 'Analyzing...' : 'AI Diagnostic'}
                                </Button>
                              ) : (
                                <div className="h-12 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-xl text-xs font-bold border border-indigo-500/30">
                                  <Activity className="w-4 h-4 mr-2" />
                                  AI PROCESSED
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Analysis Insight Pane */}
                        <div className="xl:col-span-7 p-8 bg-black/20">
                          {point.aiAnalysis?.status === 'completed' ? (
                            <div className="h-full">
                              <div className="flex items-center justify-between mb-6">
                                <h5 className="text-teal-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> AI DIAGNOSTIC REPORT
                                </h5>
                                <div className="text-teal-100/30 text-[10px] font-bold">STATIONARY AUSCULTATION</div>
                              </div>
                              <AIAnalysisCard analysis={point.aiAnalysis} />
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-12">
                              <div className="w-20 h-20 bg-teal-500/5 rounded-full border border-teal-500/10 flex items-center justify-center">
                                <Settings2 className="w-10 h-10 text-teal-900/40" />
                              </div>
                              <div>
                                <h5 className="text-teal-100/40 font-bold uppercase tracking-[0.2em] text-xs">Diagnostic Insight Locked</h5>
                                <p className="text-teal-100/20 text-xs mt-2 max-w-[200px] mx-auto leading-relaxed">
                                  Process the audio with DSP filtering and AI Analytics to generate clinical insights for this point.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* SHARED CHAT RECORDINGS SECTION */}
              {audioMessages.length > 0 && (
                <div className="mt-12 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-purple-400" />
                      Shared Chat Recordings
                    </h3>
                    <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
                      {audioMessages.length} Shared Files
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audioMessages.map((msg) => (
                      <Card key={msg._id} className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-all group overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm">Recording {new Date(msg.createdAt).toLocaleDateString()}</p>
                                <p className="text-[10px] text-teal-100/40 uppercase font-bold tracking-widest">
                                  Sent at {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteMessage(msg._id)}
                              className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-4">
                            <audio 
                              controls 
                              src={`${BASE_API_URL}/messages/file/public/${msg.fileId}`} 
                              className="w-full h-8 custom-audio-player"
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <a 
                              href={`${BASE_API_URL}/messages/file/public/${msg.fileId}`} 
                              download={msg.fileName || "shared_audio.wav"}
                              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-2 uppercase tracking-widest"
                            >
                              <Download className="w-3 h-3" /> Download File
                            </a>
                            <span className="text-[10px] text-teal-100/20 font-bold uppercase">
                              {msg.fileSize ? (msg.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
