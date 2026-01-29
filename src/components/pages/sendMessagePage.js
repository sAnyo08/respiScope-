import { useState, useContext, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Navbar from "../utils/Navbar";
import { socket } from "../../socket";

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

  const bottomRef = useRef(null);
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

  /* ---------------- SEND FILE (REST) ---------------- */
  const sendFileMessage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("consultationId", consultationId);
    formData.append("messageType", "file");

    try {
      const res = await fetch("http://localhost:5000/message/file", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data.data]);
      setFile(null);
    } catch {
      setError("File upload failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex h-[75vh] bg-white rounded-xl shadow overflow-hidden">

          {/* -------- RECEIVER SIDEBAR -------- */}
          <div className="w-1/4 border-r p-4 bg-gray-50">
            {receiver && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                  {receiver.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{receiver.name}</p>
                  <p className="text-sm text-gray-500">
                    {role === "patient" ? "Doctor" : "Patient"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* -------- CHAT AREA -------- */}
          <div className="flex flex-col w-3/4">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isSender = msg.senderId === user._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        isSender
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.messageType === "text" && <p>{msg.text}</p>}

                      {msg.messageType === "file" && (
                        <a
                          href={`http://localhost:5000/message/file/${msg.fileId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          📎 Download file
                        </a>
                      )}

                      <div className="text-[10px] opacity-70 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2"
              />

              <Button onClick={sendTextMessage}>Send</Button>
              <Button onClick={sendFileMessage}>Upload</Button>
            </div>

            {error && <p className="text-red-500 text-sm p-2">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMessagePage;
