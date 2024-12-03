import { NextFunction, Request, Response } from "express";
import Message from "@/models/message.model";
import User from "@/models/user.model";
import cloudinary from "@/lib/cloudinary";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json({
            success: true,
            message: "Successfully get the users !",
            data: filteredUsers
        })
    } catch (error) {
        console.log("Error in getUsers controller " + error)

        next(error);
    }
}

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Successfully get the messages !",
            data: messages
        })
    } catch (error) {
        console.log("Error in getMessage Controllers")
        next(error)
    }
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl: string | undefined;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        const savedMessage = await newMessage.save();

        // todo: realtime functionality goes here => socket.io

        res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: savedMessage,
        });
    } catch (error) {
        console.log("error in send message controller " + error)
        next(error);
    }
} 