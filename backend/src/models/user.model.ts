import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    profilePic?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePic: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;