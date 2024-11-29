import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import authRoutes from "@/routes/auth.route";
import { connectDB } from "@/lib/db";

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  connectDB();
});