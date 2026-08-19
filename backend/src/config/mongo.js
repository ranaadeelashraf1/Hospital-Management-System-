import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/medicare_hms";

export async function connectMongo() {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected.");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

export function disconnectMongo() {
  return mongoose.disconnect();
}
