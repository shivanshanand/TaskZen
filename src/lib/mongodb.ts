import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return await mongoose.connect(MONGO_URI);
}

export default connectDB;
