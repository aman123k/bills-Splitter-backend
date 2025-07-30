import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  splitBetween: { type: Array, required: true },
  expenseType: { type: String, required: true },
  expenseNote: { type: String, trim: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const expenseModel = mongoose.model("expense", expenseSchema);

export default expenseModel;
