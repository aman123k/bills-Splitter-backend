import mongoose from "mongoose";

// Defining user Schema
const groupSchema = mongoose.Schema({
  groupName: { type: String, trim: true, requied: true, toUpperCase: true },
  member: { type: Array, requied: true },
  groupType: { type: String, requied: true },
  createrId: { type: String },
  time: { type: String, requied: true },
  totalExpensesAmount: { type: Number, trim: true },
  totalExpenses: { type: Number, trim: true },
  totalSettledExpenses: { type: Number, trim: true },
});

// model for user Schema

const groupModel = mongoose.model("group", groupSchema);

export default groupModel;
