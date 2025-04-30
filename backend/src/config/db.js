import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...", config.MONGO_URI);
    
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
