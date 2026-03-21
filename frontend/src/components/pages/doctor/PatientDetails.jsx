import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioWaveform from "../../ui/AudioWaveform";
import LiveAudioStream from "../../ui/LiveAudioStream";
import AIAnalysisCard from "../../ui/AIAnalysisCard";
import { Activity, Trash2 } from "lucide-react";
import { Button } from "../../ui/Button";
import api from "../../../services/api/api";

const PatientDetails = () => {
// ... inside component ...
  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setAudioMessages(prev => prev.filter(m => m._id !== id));
      alert("Recording deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
// ... logic continues ...

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
      alert("Filter applied successfully!");
    } catch (err) {
      console.error("Error processing audio", err);
      alert("Failed to process audio: " + (err.response?.data?.error || err.message));
    }
  };

  const runAIAnalysis = async (messageId) => {
    try {
      const res = await api.post(`/audio/ai-analyze/${messageId}`);
      // The update will likely come through a manual refresh or we can update local state
      alert("AI Analysis triggered successfully!");
      // Optionally refresh messages
      api.get(`/messages/consultation/${selectedConsultation._id}/audio`)
        .then((res) => setAudioMessages(res.data));
    } catch (err) {
      console.error("Error triggering AI", err);
      alert("AI Analysis failed: " + (err.response?.data?.error || err.message));
    }
  }

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const FILE_BASE_URL = API_URL.replace("/api", "/api/messages/file/public");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ---------- SIDEBAR ---------- */}
      <div className="w-80 bg-white border-r p-6 overflow-y-auto">
        {patient && (
          <>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-sm text-gray-600">
              Age: {patient.age} | Phone: {patient.phone}
            </p>
          </>
        )}

        <h3 className="mt-6 mb-3 font-semibold text-gray-700">
          Consultations
        </h3>

        <div className="space-y-2">
          {consultations.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedConsultation(c)}
              className={`w-full text-left p-3 rounded-lg border ${selectedConsultation?._id === c._id
                ? "bg-teal-100 border-teal-400"
                : "hover:bg-gray-100"
                }`}
            >
              <p className="text-sm font-medium">
                Consultation #{c._id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-8 overflow-y-auto w-full">

        <div className="border-2 bg-black rounded-lg p-4 mb-6 relative">
          <h3 className="text-green-400 font-bold mb-2 z-10 relative neon-text">Live Vitals Stream</h3>
          <LiveAudioStream />
        </div>

        {!selectedConsultation ? (
          <p className="text-gray-500">
            Select a consultation to view audio files
          </p>
        ) : audioMessages.length === 0 ? (
          <p className="text-gray-500">
            No audio recordings shared in this consultation
          </p>
        ) : (
          <div className="space-y-6">
            {audioMessages.filter(m => m.messageType === "audio").map((msg) => {
              return (
                <div
                  key={msg._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium text-gray-600">
                        Recording from{" "}
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2 items-center">
                        <a
                          href={`${FILE_BASE_URL}/${msg.fileId}`}
                          download
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                        >
                          Raw
                        </a>
                        {msg.filteredFileId && (
                          <a
                            href={`${FILE_BASE_URL}/${msg.filteredFileId}`}
                            download
                            className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded hover:bg-teal-100 transition"
                          >
                            Filtered
                          </a>
                        )}
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Recording"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-2">
                      {msg.filteredFileId ? "Filtered Heart Sound" : "Raw Audio Data"}
                    </h4>
                    <div className="bg-black p-2 rounded-lg shadow-inner">
                      <AudioWaveform 
                        fileId={msg.filteredFileId || msg.fileId} 
                        peaks={msg.aiAnalysis?.peaks} 
                      />
                    </div>
                    <audio
                      controls
                      src={`${FILE_BASE_URL}/${msg.filteredFileId || msg.fileId}`}
                      className="w-full mt-3 h-10"
                    />

                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                      {!msg.filteredFileId ? (
                        <Button
                          onClick={() => processAudio(msg._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                        >
                          Run DSP Filter
                        </Button>
                      ) : (!msg.aiAnalysis || msg.aiAnalysis.status === 'failed') ? (
                        <Button
                          onClick={() => runAIAnalysis(msg._id)}
                          className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                        >
                          Run AI Diagnostics
                        </Button>
                      ) : (
                        <div className="text-center py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                          AI ANALYSIS COMPLETE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Analysis Column */}
                  <div className="flex flex-col justify-center">
                    {msg.aiAnalysis ? (
                      <AIAnalysisCard analysis={msg.aiAnalysis} />
                    ) : (
                      <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                        <Activity className="w-12 h-12 text-gray-300 mb-4" />
                        <h5 className="text-gray-400 font-bold">Waiting for Processing</h5>
                        <p className="text-gray-400 text-xs">Diagnostic insights and spectrogram will appear here after filtering and AI analysis.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
