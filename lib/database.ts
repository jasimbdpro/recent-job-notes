import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async (): Promise<void> => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }

        await mongoose.connect(mongoUri, {
            dbName: "recent_job",
        });

        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error instanceof Error ? error.message : error);
    }
};
