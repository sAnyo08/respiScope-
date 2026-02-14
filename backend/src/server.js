require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Make io accessible everywhere
app.set("io", io);

require("./sockets/chatSocket")(io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    if (process.env.NODE_ENV !== "test") { 
      app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
    
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });

  server.listen(5001, () => {
    console.log("Server running on port 5001");
  });