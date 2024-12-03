import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "@/lib/db";
import authRoutes from "@/routes/auth.route";
import messageRoutes from "@/routes/message.route";
import errorHandler from "@/middleware/error-handler.middleware";

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  connectDB();
});