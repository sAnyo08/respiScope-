const Consultation = require("../models/Consultation");
const Message = require("../models/message");
const { verifyAccessToken } = require("../utils/jwt");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔐 Authenticate socket
    socket.on("authenticate", (token) => {
      try {
        const payload = verifyAccessToken(token);
        socket.userId = payload.id;
        socket.role = payload.role;
        console.log("Socket authenticated:",socket.role, socket.userId);
      } catch (err) {
        console.log("Socket auth failed:", err.message);
        socket.emit("auth-error", "Invalid token");
        // ❌ DO NOT disconnect immediately while debugging
      }
    });

    // 🔗 Join consultation room
    socket.on("join-consultation", async ({ consultationId }) => {
      console.log("Join request:", consultationId);

      if (!socket.userId) {
        console.log("Join blocked: unauthenticated socket");
        return;
      }

      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        console.log("Consultation not found");
        return;
      }
      // Authorization
      if (
        consultation.doctorId.toString() !== socket.userId &&
        consultation.patientId.toString() !== socket.userId
      ) {
        return;
      }

      socket.join(consultationId);
      console.log(`Joined consultation room: ${consultationId}`);
    });

    // 💬 Send message
    socket.on("send-message", async ({ consultationId, text }) => {
      try {
        if (!socket.userId || !socket.role) {
          console.log("Message blocked: unauthenticated socket");
          return;
        }
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) return;

        const receiverId =
          socket.role === "patient"
            ? consultation.doctorId
            : consultation.patientId;

        const message = await Message.create({
          consultationId,
          senderRole: socket.role,
          senderId: socket.userId,
          receiverId,
          messageType: "text",
          text,
        });

        // Emit to both users in room
        io.to(consultationId).emit("new-message", message);
      } catch (err) {
        console.error("Socket message error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
