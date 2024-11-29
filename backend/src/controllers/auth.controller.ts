import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "@/models/user.model";
import { generateToken } from "@/lib/utils";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "Invalid user data !" })
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters !" })
            return;
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(400).json({ message: "Email already exist !" })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });

        if (newUser) {
            const payload = {
                userId: newUser._id as string,
                email: newUser.email,
            }

            generateToken(payload, res);
            await newUser.save();

            res.status(201).json({
                message: "Successfully created new User !",
                data: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                }
            })

            return;
        } else {
            res.status(400).json({ message: "Invalid user data !" })

            return;
        }
    } catch (error) {
        console.log("Error in sign up controller " + error)

        if (error instanceof Error && process.env.NODE_ENV === "development") {
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        } else {
            res.status(500).json({
                message: "Unknown server error"
            });
        }
    }
}

export const login = (req: Request, res: Response) => {
    res.send("login route")
}

export const logout = (req: Request, res: Response) => {
    res.send("logout route")
}