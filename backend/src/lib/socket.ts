import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  transports: ["websocket"],
});

const usersSocket: Record<string, string> = {};

const getReceiverSocketId = (userId: string) => {
  return usersSocket[userId];
};

io.use((socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error("No cookie"));

    const token = cookie
      .split("; ")
      .find(row => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  console.log("User connected:", userId);

  if (userId) {
    usersSocket[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(usersSocket));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete usersSocket[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocket));
  });
});

export { io, app, server, getReceiverSocketId };
