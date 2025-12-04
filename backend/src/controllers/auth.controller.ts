import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      generateToken(newUser._id.toString(), res);
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

    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });

      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });

      return;
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.log("Error in login controller " + error)

    next(error)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  try {
    if (!profilePic) {
      res.status(400).json({ success: false, message: "Profile pic is required" });

      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: uploadResponse.secure_url,
    }, { new: true }).select("-password");

    res.status(200).json({ success: true, message: "User successfully updated", data: updatedUser })
  } catch (error) {
    console.log("Error in update profile controller" + error);

    next(error);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller " + error)

    next(error)
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check auth controller" + error)
    next(error);
  }
}
