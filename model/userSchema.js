import mongoose from "mongoose";

// Defining user Schema
const userSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, trim: true },
  loginWith: { type: String, trim: true, required: true },
});

// model for user Schema

const userModel = mongoose.model("user", userSchema);

export default userModel;
