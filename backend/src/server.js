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
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Make io accessible everywhere
app.set("io", io);

require("./sockets/chatSocket")(io);

/* ================= RAW WEBSOCKET (ESP32 STREAM) ================= */

const wss = new WebSocket.Server({
  server,
  path: "/iot-stream",
});

let browserClients = [];

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection:", req.url);

  // If ESP32 connects
  if (req.headers["user-agent"]?.includes("ESP32")) {
    console.log("ESP32 connected for streaming");

    ws.on("message", (data) => {
      // Broadcast to browser listeners
      browserClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

  } else {
    console.log("Browser connected for listening");
    browserClients.push(ws);

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