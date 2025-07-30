import mongoose from "mongoose";

// Defining user Schema
const groupSchema = mongoose.Schema({
  groupName: { type: String, trim: true, required: true, toUpperCase: true },
  members: { type: Array, required: true },
  groupType: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  time: { type: String, required: true },
  totalExpensesAmount: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  totalSettledExpenses: { type: Number, default: 0 },
});

// model for user Schema

const groupModel = mongoose.model("group", groupSchema);

export default groupModel;
