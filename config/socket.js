const { Server } = require("http");
const { Server, Socket } = require("socket.io");

let io;

// userId → socketId map (ek user ke multiple tabs handle karne ke liye)
const onlineUsers = new Map();

exports.initSocket = (httpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.BACKEND_BASE_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User apna userId register karay
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(`user_${userId}`); // user-specific room
      console.log(`✅ User ${userId} joined room user_${userId}`);
    });

    socket.on("disconnect", () => {
      // Remove from onlineUsers map
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
        }
      });
    });
  });

  return io;
};

// Kisi specific user ko notification send karo
exports.sendNotificationToUser = (userId, notification) => {
  if (!io) return;
  io.to(`user_${userId}`).emit("notification", notification);
};

exports.getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, sendNotificationToUser, getIO, onlineUsers };