import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, FileText, Download, User, Phone, Mail, Calendar } from 'lucide-react';

const DoctorPatientChat = () => {
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Get userId from URL
  const getUserIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('userId') || window.location.pathname.split('/').pop();
  };

  const userId = getUserIdFromUrl();

  // Fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:5000/message/${userId}`);
        const data = await response.json();
        
        setMessages(data.messages || []);
        setDocuments(data.documents || []);
        setReceiverDetails(data.receiverDetails || {});
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchChatData();
    }
  }, [userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/chat/${userId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });

      const data = await response.json();
      
      setMessages([...messages, {
        id: Date.now(),
        text: newMessage,
        sender: 'doctor',
        timestamp: new Date().toISOString()
      }]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/chat/${userId}/document`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      setDocuments([...documents, {
        id: Date.now(),
        name: file.name,
        size: file.size,
        uploadedBy: 'doctor',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {receiverDetails?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {receiverDetails?.name || 'Patient'}
                </h2>
                <p className="text-sm text-gray-500">
                  {receiverDetails?.status || 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  msg.sender === 'doctor'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Paperclip className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Receiver Details & Documents */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        {/* User Details */}
        <div className="p-6 border-b">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
              {receiverDetails?.name?.charAt(0) || 'P'}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {receiverDetails?.name || 'Patient Name'}
            </h3>
            <p className="text-sm text-gray-500">
              {receiverDetails?.role || 'Patient'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">
                {receiverDetails?.email || 'email@example.com'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">
                {receiverDetails?.phone || '+1 234 567 8900'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">
                {receiverDetails?.lastVisit || 'No recent visits'}
              </span>
            </div>
          </div>
        </div>

        {/* Shared Documents */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Shared Documents
          </h4>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No documents shared yet
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.size)} • {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientChat;