import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioWaveform from "../../ui/AudioWaveform";
import LiveAudioStream from "../../ui/LiveAudioStream";
import AIAnalysisCard from "../../ui/AIAnalysisCard";
import { Activity, Trash2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import api from "../../../services/api/api";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../ui/Toast";

const PatientDetails = () => {
  const { toasts, addToast, removeToast } = useToast();

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

  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [audioMessages, setAudioMessages] = useState([]);

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

  /* ---------------- FETCH AUDIO FILES ---------------- */
  useEffect(() => {
    if (!selectedConsultation) return;

    api.get(`/messages/consultation/${selectedConsultation._id}/audio`)
      .then((res) => setAudioMessages(res.data))
      .catch(err => console.error("Error fetching audio messages", err));
  }, [selectedConsultation]);

  const processAudio = async (messageId) => {
    try {
      const res = await api.post(`/audio/process/${messageId}`);
      if (res.data && res.data.data) {
        setAudioMessages(prev => [res.data.data, ...prev]);
      }
      addToast("Filter applied successfully!", "success");
    } catch (err) {
      console.error("Error processing audio", err);
      addToast("Failed to process audio: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const runAIAnalysis = async (messageId) => {
    try {
      const res = await api.post(`/audio/ai-analyze/${messageId}`);
      if (res.data && res.data.data) {
        setAudioMessages(prev => prev.map(m => m._id === messageId ? res.data.data : m));
      }
      addToast("AI Analysis completed successfully!", "success");
    } catch (err) {
      console.error("Error triggering AI", err);
      addToast("AI Analysis failed: " + (err.response?.data?.error || err.message), "error");
    }
  };
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const FILE_BASE_URL = API_URL.replace("/api", "/api/messages/file/public");

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* ---------- SIDEBAR ---------- */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 p-6 overflow-y-auto z-10">
        {patient && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-teal-50">{patient.name}</h2>
            <p className="text-sm text-teal-200/80 mt-1">
              Age: {patient.age} | Phone: {patient.phone}
            </p>
          </div>
        )}

        <h3 className="mt-6 mb-3 font-semibold text-teal-400 flex items-center gap-2">
          Consultations
        </h3>

        <div className="space-y-3">
          {consultations.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedConsultation(c)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${selectedConsultation?._id === c._id
                ? "bg-teal-500/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
            >
              <p className={`text-sm font-bold ${selectedConsultation?._id === c._id ? "text-teal-100" : "text-gray-200"}`}>
                Consultation #{c._id.slice(-6)}
              </p>
              <p className="text-xs text-teal-200/60 mt-1">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-3 overflow-y-auto w-full relative">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

        <Card className="mb-4 border-teal-500/30 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
          <CardContent className="p-2 relative">
            <div className="flex items-center gap-3 mb-2 z-10 relative">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]"></div>
              <h3 className="text-teal-400 tracking-wide">LIVE VITALS STREAM</h3>
            </div>
            <div className="bg-black/40 rounded-xl overflow-hidden border border-white/5 relative z-10">
              <LiveAudioStream />
            </div>
          </CardContent>
        </Card>

        {!selectedConsultation ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Activity className="w-16 h-16 text-teal-900/50 mb-4" />
            <p className="text-teal-200/50 text-lg">Select a consultation to view audio files</p>
          </div>
        ) : audioMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <p className="text-teal-200/60 text-lg">No audio recordings shared in this consultation</p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {audioMessages.filter(m => m.messageType === "audio").map((msg) => {
              return (
                <Card
                  key={msg._id}
                  className="bg-white/5 border-white/10 overflow-hidden"
                >
                  <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-2 border-r border-white/10 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-medium text-teal-200/60 uppercase tracking-wider">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                        <div className="flex gap-2 items-center">
                          <a
                            href={`${FILE_BASE_URL}/${msg.fileId}`}
                            download
                            className="text-[10px] font-bold tracking-wider bg-white/10 text-teal-50 px-3 py-1.5 rounded-md hover:bg-white/20 transition backdrop-blur-sm"
                          >
                            RAW AUDIO
                          </a>
                          {msg.filteredFileId && (
                            <a
                              href={`${FILE_BASE_URL}/${msg.filteredFileId}`}
                              download
                              className="text-[10px] font-bold tracking-wider bg-teal-500/20 border border-teal-500/30 text-teal-100 px-3 py-1.5 rounded-md hover:bg-teal-500/40 transition backdrop-blur-sm"
                            >
                              FILTERED
                            </a>
                          )}
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                            title="Delete Recording"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-teal-50 mb-2 flex items-center gap-2">
                        {msg.filteredFileId ? (
                          <><Activity className="w-4 h-4 text-teal-400" /> Filtered Heart Sound</>
                        ) : (
                          <><Activity className="w-4 h-4 text-gray-400" /> Raw Audio Data</>
                        )}
                      </h4>
                      <div className="bg-black/60 p-2 rounded-xl shadow-inner border border-white/5">
                        <AudioWaveform 
                          fileId={msg.filteredFileId || msg.fileId} 
                          peaks={msg.aiAnalysis?.peaks} 
                        />
                      </div>
                      <audio
                        controls
                        src={`${FILE_BASE_URL}/${msg.filteredFileId || msg.fileId}`}
                        className="w-full mt-3 h-10 opacity-80"
                      />

                      <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                        {!msg.filteredFileId ? (
                          <Button
                            variant="primary"
                            onClick={() => processAudio(msg._id)}
                            className="w-full"
                          >
                            Run DSP Filter
                          </Button>
                        ) : (!msg.aiAnalysis || msg.aiAnalysis.status === 'failed') ? (
                          <Button
                            variant="primary"
                            onClick={() => runAIAnalysis(msg._id)}
                            className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-indigo-50 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                          >
                            Run AI Diagnostics
                          </Button>
                        ) : (
                          <div className="text-center py-3 bg-teal-500/10 text-teal-300 rounded-xl text-xs font-bold border border-teal-500/20 tracking-wider">
                            AI ANALYSIS COMPLETE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Analysis Column */}
                    <div className="flex flex-col justify-center p-6 bg-black/20">
                      {msg.aiAnalysis ? (
                        <AIAnalysisCard analysis={msg.aiAnalysis} />
                      ) : (
                        <div className="h-full rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-white/5 backdrop-blur-sm">
                          <Activity className="w-12 h-12 text-teal-900/40 mb-4" />
                          <h5 className="text-teal-200/60 font-bold uppercase tracking-wider text-sm">Waiting for Processing</h5>
                          <p className="text-teal-200/40 text-xs mt-2 max-w-[200px]">Diagnostic insights from the AI will appear here.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
