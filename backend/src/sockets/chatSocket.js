const Consultation = require("../models/Consultation");
const Message = require("../models/message");
const { verifyAccessToken } = require("../utils/jwt");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔐 Authenticate socket
    socket.on("authenticate", async (token) => {
      try {
        const payload = verifyAccessToken(token);
        if (!payload || !payload.id || !payload.role) {
          throw new Error("Invalid token payload");
        }
        
        // 🔥 We need the Profile ID, not the User ID
        let profile;
        if (payload.role === "doctor") {
          profile = await Doctor.findOne({ userId: payload.id });
        } else {
          profile = await Patient.findOne({ userId: payload.id });
        }

        if (!profile) throw new Error("Profile not found");

        socket.profileId = profile._id.toString();
        socket.userId = payload.id; // Keep user ID too just in case
        socket.role = payload.role;
        console.log("Socket authenticated profile:", socket.role, socket.profileId);
      } catch (err) {
        console.log("Socket auth failed:", err.message);
        socket.emit("auth-error", "Invalid token");
      }
    });

    // 🔗 Join consultation room
    socket.on("join-consultation", async ({ consultationId }) => {
      console.log("Join request:", consultationId);

      if (!socket.profileId) {
        console.log("Join blocked: unauthenticated socket (missing profile)");
        return;
      }

      const consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        console.log("Consultation not found");
        return;
      }

      // Authorization using Profile IDs
      if (
        consultation.doctorId.toString() !== socket.profileId &&
        consultation.patientId.toString() !== socket.profileId
      ) {
        console.log("Join denied: not a participant");
        return;
      }

      socket.join(consultationId.toString());
      console.log(`Joined consultation room: ${consultationId}`);
    });

    // 💬 Send message
    socket.on("send-message", async ({ consultationId, text }) => {
      try {
        if (!socket.profileId || !socket.role) {
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
          senderId: socket.profileId, // 🔥 Store profile ID as sender
          receiverId,
          messageType: "text",
          text,
        });

        // Emit to both users in room
        io.to(consultationId.toString()).emit("new-message", message);
      } catch (err) {
        console.error("Socket message error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
