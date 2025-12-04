import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
}
