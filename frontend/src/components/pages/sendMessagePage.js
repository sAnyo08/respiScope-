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
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ui/Toast";

const SendMessagePage = () => {
  const { user, role } = useContext(AuthContext);
  const { consultationId } = useParams();
  const { state } = useLocation();

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      addToast("Message deleted", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete", "error");
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
        addToast("Failed to load messages", "error");
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
      addToast("File upload failed", "error");
      console.error("sendFileMessage error:", err);
    }
  };

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const FILE_BASE_URL = API_URL.replace("/api", "/api/messages/file/public");

  const runAIAnalysis = async (messageId) => {
    try {
      const res = await api.post(`/audio/ai-analyze/${messageId}`);
      if (res.data && res.data.data) {
        setMessages(prev => prev.map(m => m._id === messageId ? res.data.data : m));
      }
      addToast("AI Analysis triggered!", "success");
    } catch (err) {
      console.error("AI Analysis trigger failed", err);
      addToast("Failed to start AI Analysis", "error");
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
    <div className="min-h-screen bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main className="max-w-[1920px] mx-auto p-4 w-full relative h-screen overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="flex h-[calc(100vh-2rem)] bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.1)] border border-white/10 overflow-hidden relative z-10 w-full">
          {/* -------- RECEIVER SIDEBAR -------- */}
          <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col shrink-0">
            {/* Receiver Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
              {receiver ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500/80 to-emerald-600/80 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_rgba(20,184,166,0.4)] border border-white/20 backdrop-blur-sm">
                        {receiver.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#0b2b22] shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white drop-shadow-sm">
                        {role === "patient" ? "Dr. " : ""}
                        {receiver.name}
                      </h3>
                      <p className="text-sm text-teal-200/60 flex items-center gap-1">
                        {role === "patient" ? <><Stethoscope className="w-3 h-3" />Doctor</> : <><User className="w-3 h-3" />Patient</>}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {receiver.specialization && (
                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-teal-200/50 uppercase tracking-wider">Specialization</p>
                          <p className="text-sm font-medium text-teal-50">{receiver.specialization}</p>
                        </div>
                      </div>
                    )}
                    {receiver.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-teal-200/50 uppercase tracking-wider">Phone</p>
                          <p className="text-sm font-medium text-teal-50">{receiver.phone}</p>
                        </div>
                      </div>
                    )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h2 className="text-sm text-teal-50 font-bold">Consultation Chat</h2>
                            <p className="text-xs text-teal-200/50 mt-1">ID: {consultationId?.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,1)]"></div>
                          <span className="text-xs text-green-300 font-bold tracking-wide uppercase">Active</span>
                        </div>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <User className="w-8 h-8 text-teal-200/30" />
                    </div>
                    <p className="text-sm text-teal-200/50">Loading profile...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-teal-50 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-emerald-400" />
                  Shared Documents
                </h4>
                <span className="text-[10px] bg-teal-500/20 border border-teal-500/30 text-teal-200 px-2.5 py-1 rounded-full font-bold">
                  {fileMessages.length}
                </span>
              </div>

              {fileMessages.length > 0 ? (
                <div className="space-y-3">
                  {fileMessages.map((msg) => (
                    <a
                      key={msg._id}
                      href={`${FILE_BASE_URL}/${msg.fileId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block group"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-teal-400/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-300 flex-shrink-0 border border-teal-500/20 shadow-inner">
                            {getFileIcon(msg.fileName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-teal-50 truncate group-hover:text-teal-300 transition-colors">
                              {msg.fileName || "Document"}
                            </p>
                            <p className="text-xs text-teal-200/50">{new Date(msg.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Download className="w-4 h-4 text-teal-200/30 group-hover:text-white transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-black/20 rounded-xl border border-white/5 h-40">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-teal-200/30" />
                  </div>
                  <p className="text-xs text-teal-200/50 uppercase tracking-widest font-semibold">No documents shared</p>
                </div>
              )}
            </div>
          </div>

          {/* -------- CHAT AREA -------- */}
          <div className="flex flex-col flex-1 relative w-full overflow-hidden">

            {/* Live Streaming Monitor */}
            <div className="px-4 py-3 bg-black/40 border-b border-white/10 backdrop-blur-md relative z-20">
               <LiveAudioStream consultationId={consultationId} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent relative z-10 w-full mb-20 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto relative z-10">
                  <div className="w-24 h-24 bg-teal-500/10 border-2 border-dashed border-teal-500/30 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                    <Send className="w-10 h-10 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-teal-50 mb-3 drop-shadow-md">Start the conversation</h3>
                  <p className="text-teal-200/60 leading-relaxed font-medium">Send a secure message, attachment, or record an audio file to begin your consultation.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSender = msg.senderId === user._id;
                  return (
                    <div key={msg._id} className={`flex items-end gap-3 w-full ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                      {!isSender && (
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0b2b22] to-[#10141a] border border-white/10 rounded-full flex items-center justify-center text-teal-300 text-sm font-bold flex-shrink-0 shadow-lg">
                          {receiver?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}

                      <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-[80%]`}>
                        <div className={`px-5 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.2)] max-w-full overflow-hidden ${isSender ? "bg-gradient-to-br from-teal-600/90 to-emerald-700/90 border border-teal-500/30 text-white rounded-2xl rounded-br-sm backdrop-blur-md" : "bg-black/60 border border-white/10 text-teal-50 rounded-2xl rounded-bl-sm backdrop-blur-md"}`}>
                          {msg.messageType === "text" && <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                          {(msg.messageType === "audio" || msg.messageType === "audio_processed") && (
                            <div className="w-full space-y-4 min-w-[200px] md:min-w-[400px]">
                              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${isSender ? "text-teal-100" : "text-emerald-400"}`}>
                                  {role === "doctor" && msg.filteredFileId ? <><Activity className="w-3 h-3"/> Filtered Stethoscope</> : <><Music className="w-3 h-3"/> Audio Record</>}
                                </span>
                                {role === "doctor" && msg.aiAnalysis && (
                                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-white border border-white/20 shadow-inner">
                                    <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> API Processed
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
                                <div className="mt-3 space-y-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                  {msg.aiAnalysis ? (
                                    <AIAnalysisCard analysis={msg.aiAnalysis} />
                                  ) : !msg.filteredFileId ? (
                                    <button 
                                      onClick={() => {
                                        api.post(`/audio/process/${msg._id}`)
                                          .then(() => addToast("DSP Filter applied!", "success"))
                                          .catch(err => console.error(err));
                                      }}
                                      className="w-full bg-indigo-600/90 text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400/30"
                                    >
                                      <Activity className="w-3 h-3" />
                                      Apply DSP Filter
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => runAIAnalysis(msg._id)}
                                      className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-100 text-[11px] font-bold py-2.5 rounded-lg border border-teal-500/40 transition-all flex items-center justify-center gap-2 shadow-inner"
                                    >
                                      <Zap className="w-3 h-3" />
                                      Run AI Diagnostics
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/10">
                                <a href={`${FILE_BASE_URL}/${msg.fileId}`} download={msg.fileName || "recording.wav"} className={`text-[10px] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider ${isSender ? "text-teal-100" : "text-teal-400"}`}>
                                  <Download className="w-3 h-3" /> Get Original
                                </a>
                                {role === "doctor" && (
                                  <button 
                                    onClick={() => deleteMessage(msg._id)}
                                    className={`p-1.5 rounded-lg transition-colors ${isSender ? "hover:bg-red-500/30 text-white hover:text-red-200" : "hover:bg-red-500/20 text-red-400"}`}
                                    title="Delete Message"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 px-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-[10px] font-medium text-teal-200/50">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isSender && <CheckCheck className="w-3.5 h-3.5 text-teal-500/70" />}
                        </div>
                      </div>

                      {isSender && (
                        <div className="w-10 h-10 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold flex-shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.3)] shadow-inner">
                          {user?.name?.[0]?.toUpperCase() || "Y"}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} className="pb-4" />
            </div>

            <div className="absolute bottom-0 w-full left-0 border-t border-white/10 bg-black/60 p-4 backdrop-blur-xl z-20 h-auto">
              {file && (
                <div className="mb-4 flex items-center gap-3 bg-white/5 border border-white/10 shadow-inner rounded-xl p-3 pr-4 max-w-sm">
                  <div className="w-10 h-10 bg-teal-500/20 shadow-inner rounded-lg flex items-center justify-center text-teal-400 border border-teal-500/20">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-teal-50 truncate">{file.name}</p>
                    <p className="text-[10px] font-semibold text-teal-200/50 uppercase tracking-widest mt-0.5">{formatFileSize(file.size)}</p>
                  </div>
                  <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group">
                    <X className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3 max-w-5xl mx-auto">
                <input ref={fileInputRef} type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex-shrink-0 w-[52px] h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-inner group">
                  <Paperclip className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                </label>

                <div className="flex-1 relative">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a secure message..." rows={1} className="w-full bg-[#0b2b22]/50 text-white placeholder-teal-200/40 border border-teal-500/30 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:border-teal-400 focus:bg-[#0b2b22] focus:shadow-[0_0_20px_rgba(20,184,166,0.1)] resize-none transition-all text-sm font-medium" style={{ minHeight: "52px", maxHeight: "120px" }} />
                </div>

                <Button onClick={file ? sendFileMessage : sendTextMessage} disabled={!file && !text.trim()} className="flex-shrink-0 w-[52px] h-[52px] bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-50 disabled:from-teal-900 disabled:to-[#0b2b22] text-white rounded-2xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(20,184,166,0.4)] border border-teal-400/50 disabled:border-white/5 disabled:shadow-none">
                  <Send className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMessagePage;
