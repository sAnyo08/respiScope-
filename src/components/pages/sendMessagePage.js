import { useState, useContext, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Navbar from "../utils/Navbar";

const SendMessagePage = () => {
  const { user } = useContext(AuthContext);
  const { consultationId } = useParams();
  const { state } = useLocation();
  const { doctorId } = state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Fetch existing messages for the consultation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/message/${consultationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages");
        console.error(err.message);
      }
    };
    if (consultationId) {
      fetchMessages();
    }
  }, [consultationId]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/message/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          consultationId,
          senderRole: "patient",
          senderId: user._id,
          receiverId: doctorId,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setMessage("");
      setError(null);
    } catch (err) {
      setError("Failed to send message");
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-300 to-mint-400">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Consultation Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              <div className="h-96 overflow-y-auto border border-gray-200 p-4 rounded-lg">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-4 p-3 rounded-lg ${
                        msg.senderRole === "patient" ? "bg-teal-100 ml-auto" : "bg-gray-100"
                      } max-w-md`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-6"
                >
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SendMessagePage;