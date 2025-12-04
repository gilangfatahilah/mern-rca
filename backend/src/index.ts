import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import errorHandler from "./middleware/error-handler.middleware";
import { app, server } from "./lib/socket";

dotenv.config();

const port = process.env.PORT || 8000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(errorHandler);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
  });
});
