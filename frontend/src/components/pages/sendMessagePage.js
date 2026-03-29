import { useState, useContext, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import AudioWaveform from "../ui/AudioWaveform";
import LiveAudioStream from "../ui/LiveAudioStream";
import AIAnalysisCard from "../ui/AIAnalysisCard";
import { Activity } from "lucide-react";
//import Navbar from "../utils/Navbar";
import { socket } from "../../socket";
import api from "../../services/api/api";
import {
  Send,
  Paperclip,
  FileText,
  Download,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Check,
  CheckCheck,
  Clock,
  User,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  FolderOpen,
  X,
  Zap,
  Trash2,
} from "lucide-react";

const SendMessagePage = () => {
  const { user, role } = useContext(AuthContext);
  const { consultationId } = useParams();
  const { state } = useLocation();

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- SOCKET SETUP ---------------- */
  useEffect(() => {
    if (!consultationId) return;

    socket.connect();
    socket.emit("authenticate", token);
    socket.emit("join-consultation", { consultationId });

    socket.on("new-message", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    socket.on("ai-analysis-complete", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    });

    socket.on("message-deleted", (deletedId) => {
      setMessages((prev) => prev.filter((m) => m._id !== deletedId));
    });

    return () => {
      socket.off("new-message");
      socket.off("ai-analysis-complete");
      socket.off("message-deleted");
      socket.disconnect();
    };
  }, [consultationId, token]);

  /* ---------------- FETCH OLD MESSAGES ---------------- */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/consultation/${consultationId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        setError("Failed to load messages");
        console.error("fetchMessages error:", err);
      }
    };

    fetchMessages();
  }, [consultationId]);

  /* ---------------- FETCH RECEIVER INFO ---------------- */
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        // Updated endpoint to /api/consultations/:id/participant
        const res = await api.get(`/consultations/${consultationId}/participant`);
        setReceiver(res.data);
      } catch (err) {
        console.error("fetchReceiver error:", err);
        setReceiver(null);
      }
    };

    fetchReceiver();
  }, [consultationId]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND TEXT (SOCKET) ---------------- */
  const sendTextMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", { consultationId, text });
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  /* ---------------- SEND FILE (REST) ---------------- */
  const sendFileMessage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("consultationId", consultationId);
    formData.append("senderRole", role);
    formData.append("senderId", user._id);
    formData.append("messageType", "audio");

    try {
      const res = await api.post("/messages/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, res.data.data]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError("File upload failed");
      console.error("sendFileMessage error:", err);
    }
  };

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const FILE_BASE_URL = API_URL.replace("/api", "/api/messages/file/public");

  const runAIAnalysis = async (messageId) => {
    try {
      await api.post(`/audio/ai-analyze/${messageId}`);
      alert("AI Analysis triggered!");
    } catch (err) {
      console.error("AI Analysis trigger failed", err);
      alert("Failed to start AI Analysis");
    }
  };

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const getFileIcon = (filename) => {
    if (!filename) return <File className="w-5 h-5" />;
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <ImageIcon className="w-5 h-5" />;
    if (["mp4", "avi", "mov", "wmv"].includes(ext)) return <Video className="w-5 h-5" />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext)) return <Music className="w-5 h-5" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const fileMessages = messages.filter((msg) => msg.messageType === "file" || msg.messageType === "audio");

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* <Navbar
        userType={role}
        userName={role === "doctor" ? `Dr. ${user?.name}` : user?.name}
        userCode={user?.code || user?._id?.slice(-6)}
      /> */}

      <main className="max-w-9xl mx-auto px-2 py-2">
        <div className="flex h-[98vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* -------- RECEIVER SIDEBAR -------- */}
          <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 flex flex-col">
            {/* Receiver Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              {receiver ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                        {receiver.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {role === "patient" ? "Dr. " : ""}
                        {receiver.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        {role === "patient" ? <><Stethoscope className="w-3 h-3" />Doctor</> : <><User className="w-3 h-3" />Patient</>}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {receiver.specialization && (
                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Specialization</p>
                          <p className="text-sm font-medium text-gray-800">{receiver.specialization}</p>
                        </div>
                      </div>
                    )}
                    {receiver.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-800">{receiver.phone}</p>
                        </div>
                      </div>
                    )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h2 className="text-sm text-gray-800">Consultation Chat</h2>
                            <p className="text-sm text-gray-600">ID: {consultationId?.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-600 font-medium">Active</span>
                        </div>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Loading profile...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-teal-600" />
                  Shared Documents
                </h4>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-semibold">
                  {fileMessages.length}
                </span>
              </div>

              {fileMessages.length > 0 ? (
                <div className="space-y-2">
                  {fileMessages.map((msg) => (
                    <a
                      key={msg._id}
                      href={`${FILE_BASE_URL}/${msg.fileId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block group"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-teal-400 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                            {getFileIcon(msg.fileName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-teal-600 transition-colors">
                              {msg.fileName || "Document"}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No documents shared yet</p>
                </div>
              )}
            </div>
          </div>

          {/* -------- CHAT AREA -------- */}
          <div className="flex flex-col flex-1">

            {/* Live Streaming Monitor */}
            <div className="px-2 py-2 bg-gray-50 border-b">
               <LiveAudioStream consultationId={consultationId} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Start the conversation</h3>
                  <p className="text-sm text-gray-500 max-w-sm">Send a message to begin your consultation</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSender = msg.senderId === user._id;
                  return (
                    <div key={msg._id} className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                      {!isSender && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {receiver?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}

                      <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-lg`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm ${isSender ? "bg-gradient-to-br from-teal-100 to-cyan-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"}`}>
                          {msg.messageType === "text" && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                          {(msg.messageType === "audio" || msg.messageType === "audio_processed") && (
                            <div className="w-full space-y-3 min-w-[600px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSender ? "text-teal-50" : "text-teal-600"}`}>
                                  {role === "doctor" && msg.filteredFileId ? "Filtered Heart Sound" : "Audio Recording"}
                                </span>
                                {role === "doctor" && msg.aiAnalysis && (
                                  <div className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                    <Zap className="w-2.5 h-2.5 fill-current" /> AI ANALYZED
                                  </div>
                                )}
                              </div>
                              
                              <AudioWaveform 
                                fileId={(role === "doctor" && msg.filteredFileId) || msg.fileId} 
                                peaks={role === "doctor" ? msg.aiAnalysis?.peaks : []} 
                              />
                              
                              <audio controls preload="metadata" className={`w-full h-8 rounded-md ${isSender ? "opacity-90" : ""}`} src={`${FILE_BASE_URL}/` + ((role === "doctor" && msg.filteredFileId) || msg.fileId)} />
                              
                              {/* 👨‍⚕️ Doctor-Only AI Controls & Results */}
                              {role === "doctor" && (
                                <div className="mt-2 space-y-2">
                                  {msg.aiAnalysis ? (
                                    <AIAnalysisCard analysis={msg.aiAnalysis} />
                                  ) : !msg.filteredFileId ? (
                                    <button 
                                      onClick={() => {
                                        api.post(`/audio/process/${msg._id}`)
                                          .then(() => alert("Filter started!"))
                                          .catch(err => console.error(err));
                                      }}
                                      className="w-full bg-indigo-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                      <Activity className="w-3 h-3" />
                                      Apply DSP Filter
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => runAIAnalysis(msg._id)}
                                      className="w-full bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 text-[10px] font-bold py-2 rounded-lg border border-teal-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                      <Zap className="w-3 h-3" />
                                      Run AI Diagnostics
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex justify-between items-center pt-1">
                                <a href={`${FILE_BASE_URL}/${msg.fileId}`} download={msg.fileName || "recording.wav"} className={`text-[10px] font-bold hover:underline flex items-center gap-1 ${isSender ? "text-teal-50" : "text-teal-600"}`}>
                                  <Download className="w-3 h-3" /> Download Original
                                </a>
                                {role === "doctor" && (
                                  <button 
                                    onClick={() => deleteMessage(msg._id)}
                                    className={`p-1 rounded-full transition-colors ${isSender ? "hover:bg-white/20 text-white" : "hover:bg-red-50 text-red-500"}`}
                                    title="Delete Message"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 px-1 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isSender && <CheckCheck className="w-3 h-3 text-teal-600" />}
                        </div>
                      </div>

                      {isSender && (
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user?.name?.[0]?.toUpperCase() || "Y"}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              {file && (
                <div className="mb-3 flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 hover:bg-red-100 rounded-full transition-colors"><X className="w-4 h-4 text-red-600" /></button>
                </div>
              )}

              <div className="flex items-end gap-3">
                <input ref={fileInputRef} type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex-shrink-0 w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors group">
                  <Paperclip className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                </label>

                <div className="flex-1 relative">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." rows={1} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-teal-400 resize-none transition-colors text-sm" style={{ minHeight: "44px", maxHeight: "120px" }} />
                </div>

                <Button onClick={file ? sendFileMessage : sendTextMessage} disabled={!file && !text.trim()} className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2"><X className="w-4 h-4" />{error}</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMessagePage;
