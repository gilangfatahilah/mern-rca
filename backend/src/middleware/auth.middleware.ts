import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user.model";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized no token provided !" });

            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (!decoded) {
            res.status(401).json({ success: false, message: "Unauthorized token is invalid !" });

            return;
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            res.status(404).json({ success: false, message: "User not found !" });

            return;
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}