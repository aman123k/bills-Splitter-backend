import mongoose from "mongoose";

// Defining user Schema
const groupSchema = mongoose.Schema({
  groupName: { type: String, trim: true, required: true, toUpperCase: true },
  member: { type: Array, required: true },
  groupType: { type: String, required: true },
  creatorId: { type: String },
  time: { type: String, required: true },
  totalExpensesAmount: { type: Number, trim: true },
  totalExpenses: { type: Number, trim: true },
  totalSettledExpenses: { type: Number, trim: true },
});

// model for user Schema

const groupModel = mongoose.model("group", groupSchema);

export default groupModel;
