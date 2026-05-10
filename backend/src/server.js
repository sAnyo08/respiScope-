require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const server = http.createServer(app);

/* ================= SOCKET.IO (CHAT) ================= */

const io = new Server(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN?.replace(/\/$/, ""),
      process.env.CORS_ORIGIN,
      "http://localhost:3000",
      "http://localhost:5173"
    ].filter(Boolean),
    credentials: true,
  },
});

// Make io accessible everywhere
app.set("io", io);

require("./sockets/chatSocket")(io);

/* ================= RAW WEBSOCKET (ESP32 STREAM) ================= */
const createWavHeader = require("./utils/wavHeader");
const Message = require("./models/message");
const Consultation = require("./models/Consultation");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const wss = new WebSocket.Server({
  server,
  path: "/iot-stream",
});

let browserClients = [];
let esp32Clients = new Map(); // consultationId -> ws

wss.on("connection", (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const consultationId = urlParams.get('consultationId');
  const device = urlParams.get('device');

  console.log(`New WebSocket connection: ${req.url} | Consultation: ${consultationId}`);

  // If ESP32 connects
  if (device === "esp32" || (!device && req.headers["user-agent"]?.includes("ESP32"))) {
    console.log("ESP32/Device connected for streaming");
    
    if (consultationId) {
      esp32Clients.set(consultationId, ws);
    }

    ws.on("message", (data) => {
      // 1. Broadcast to browser listeners
      browserClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // If browser client is also filtered by consultationId, we can add that logic
          client.send(data);
        }
      });
    });

    ws.on("close", async () => {
      console.log("Stream source disconnected.");
      if (consultationId) {
        esp32Clients.delete(consultationId);
      }
    });

  } else {
    console.log("Browser connected for listening");
    browserClients.push(ws);
    
    ws.on("message", (data) => {
      const text = data.toString();
      if (text === "START" || text === "STOP") {
        if (consultationId && esp32Clients.has(consultationId)) {
          console.log(`Routing ${text} to ESP32 for consultation ${consultationId}`);
          esp32Clients.get(consultationId).send(text);
        } else {
          console.log(`Cannot route ${text}: ESP32 not connected for consultation ${consultationId}`);
        }
      }
    });
    
    ws.on("close", () => {
      browserClients = browserClients.filter((c) => c !== ws);
    });
  }
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });