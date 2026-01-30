import { useState, useContext, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import AudioWaveform from "../ui/AudioWaveform";
import Navbar from "../utils/Navbar";
import { socket } from "../../socket";
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
} from "lucide-react";

const SendMessagePage = () => {
  const { user, role } = useContext(AuthContext);
  const { consultationId } = useParams();
  const { state } = useLocation();
  const { otherUserId } = state || {};

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

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

    return () => {
      socket.off("new-message");
      socket.disconnect();
    };
  }, [consultationId, token]);

  /* ---------------- FETCH OLD MESSAGES ---------------- */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/message/consultation/${consultationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        setError("Failed to load messages");
      }
    };

    fetchMessages();
  }, [consultationId, token]);

  /* ---------------- FETCH RECEIVER INFO ---------------- */
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/consultations/${consultationId}/participant`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReceiver(await res.json());
      } catch {
        setReceiver(null);
      }
    };

    fetchReceiver();
  }, [consultationId, token]);

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
      const res = await fetch("http://localhost:5000/message/file", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data.data]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("File upload failed");
    }
  };

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const getFileIcon = (filename) => {
    if (!filename) return <File className="w-5 h-5" />;

    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return <ImageIcon className="w-5 h-5" />;
    }
    if (["mp4", "avi", "mov", "wmv"].includes(ext)) {
      return <Video className="w-5 h-5" />;
    }
    if (["mp3", "wav", "ogg", "flac"].includes(ext)) {
      return <Music className="w-5 h-5" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext)) {
      return <FileText className="w-5 h-5" />;
    }

    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const fileMessages = messages.filter((msg) => msg.messageType === "file");

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar
        userType={role}
        userName={role === "doctor" ? `Dr. ${user?.name}` : user?.name}
        userCode={user?.code || user?._id?.slice(-6)}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* -------- RECEIVER SIDEBAR -------- */}
          <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 flex flex-col">
            {/* Receiver Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              {receiver ? (
                <div className="space-y-4">
                  {/* Avatar and Name */}
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
                        {role === "patient" ? (
                          <>
                            <Stethoscope className="w-3 h-3" />
                            Doctor
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Patient
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Receiver Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {receiver.specialization && (
                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            Specialization
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {receiver.specialization}
                          </p>
                        </div>
                      </div>
                    )}

                    {receiver.age && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="text-sm font-medium text-gray-800">
                            {receiver.age} years
                          </p>
                        </div>
                      </div>
                    )}

                    {receiver.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p
                            className="text-sm font-medium text-gray-800 truncate"
                            title={receiver.email}
                          >
                            {receiver.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {receiver.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-800">
                            {receiver.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {receiver.experience && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Experience</p>
                          <p className="text-sm font-medium text-gray-800">
                            {receiver.experience} years
                          </p>
                        </div>
                      </div>
                    )}
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
                      href={`http://localhost:5000/message/file/${msg.fileId}`}
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
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </p>
                              {msg.fileSize && (
                                <>
                                  <span className="text-xs text-gray-300">
                                    •
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(msg.fileSize)}
                                  </p>
                                </>
                              )}
                            </div>
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
                  <p className="text-sm text-gray-500">
                    No documents shared yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Files will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* -------- CHAT AREA -------- */}
          <div className="flex flex-col flex-1">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 border-b border-teal-700 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Consultation Chat
                    </h2>
                    <p className="text-xs text-teal-100">
                      ID: {consultationId?.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Start the conversation
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Send a message to begin your consultation
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSender = msg.senderId === user._id;
                  const showDate =
                    index === 0 ||
                    new Date(messages[index - 1].createdAt).toDateString() !==
                      new Date(msg.createdAt).toDateString();

                  return (
                    <div key={msg._id}>
                      {/* Date Divider */}
                      {showDate && (
                        <div className="flex items-center justify-center my-6">
                          <div className="bg-gray-200 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                            {new Date(msg.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div
                        className={`flex items-end gap-2 ${
                          isSender ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        {!isSender && (
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {receiver?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}

                        {/* Message Content */}
                        <div
                          className={`flex flex-col ${
                            isSender ? "items-end" : "items-start"
                          } max-w-lg`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isSender
                                ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-br-none"
                                : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            {msg.messageType === "text" && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>
                            )}

                            {msg.messageType === "audio" && (
                              <div className="w-full space-y-2">
                                {/* Waveform */}
                                <AudioWaveform fileId={msg.fileId} />

                                {/* Audio Player */}
                                <audio
                                  controls
                                  preload="metadata"
                                  className="w-full rounded-md"
                                  src={`http://localhost:5000/message/file/${msg.fileId}`}
                                />

                                {/* Download */}
                                <a
                                  href={`http://localhost:5000/message/file/${msg.fileId}`}
                                  download={msg.fileName || "recording.wav"}
                                  className="text-xs text-teal-600 hover:underline inline-flex items-center gap-1"
                                >
                                  ⬇ Download
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Timestamp and Status */}
                          <div
                            className={`flex items-center gap-1 mt-1 px-1 ${
                              isSender ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <span className="text-[10px] text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </span>
                            {isSender && (
                              <CheckCheck className="w-3 h-3 text-teal-600" />
                            )}
                          </div>
                        </div>

                        {/* Sender Avatar */}
                        {isSender && (
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user?.name?.[0]?.toUpperCase() || "Y"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              {/* File Preview */}
              {file && (
                <div className="mb-3 flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3">
                {/* File Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex-shrink-0 w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors group"
                >
                  <Paperclip className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                </label>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-teal-400 resize-none transition-colors text-sm"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                </div>

                {/* Send/Upload Buttons */}
                {file ? (
                  <Button
                    onClick={sendFileMessage}
                    className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={sendTextMessage}
                    disabled={!text.trim()}
                    className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMessagePage;
