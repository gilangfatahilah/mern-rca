import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
  }
});

const usersSocket: Record<string, string> = {};

const getReceiverSocketId = (userId: string) => {
  return usersSocket[userId];
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) usersSocket[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(usersSocket))

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
    delete usersSocket[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocket))
  })
})

export { io, app, server, getReceiverSocketId }
