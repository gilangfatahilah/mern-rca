import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI!);

        console.log(`Database connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`Database connection error: ${error}`);
        process.exit(1);
    }
}