import mongoose from "mongoose";

// Defining user Schema
const userSchema = mongoose.Schema({
  name: { type: String, trim: true, requied: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, required: true },
});

// model for user Schema

const userModel = mongoose.model("user", userSchema);

export default userModel;
