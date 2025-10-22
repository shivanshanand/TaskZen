import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "❌ Please define MONGO_URI environment variable in .env.local"
  );
}

async function connectDB() {
  // If already connected, return immediately
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    console.log("🔌 Connecting to MongoDB...");

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default connectDB;
