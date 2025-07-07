import mongoose from "mongoose";

const connectDb = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connection successfully");
  } catch {
    console.log("can't connect db");
  }
};
export default connectDb;
