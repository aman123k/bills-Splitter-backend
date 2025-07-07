import mongoose from "mongoose";

const expanseSchema = mongoose.Schema({
  expenseName: { type: String, trim: true, required: true, toUpperCase: true },
  amount: { type: Number, required: true },
  time: { type: String, required: true },
  upiId: { type: String },
  splitBetween: { type: Array },
  location: { type: String },
  paidBy: { type: String, required: true },
  groupId: { type: String, required: true },
});
const expenseModel = mongoose.model("expense", expanseSchema);

export default expenseModel;
