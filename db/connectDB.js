const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@conferease.dcgvcp5.mongodb.net/?retryWrites=true&w=majority&appName=ConferEase"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
