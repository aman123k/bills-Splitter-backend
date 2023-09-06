import mongoose from "mongoose";

const expanseSchema = mongoose.Schema({
  expenseName: { type: String, trim: true, requied: true, toUpperCase: true },
  amount: { type: Number, requied: true },
  upiId: { type: String },
  participants: { type: Array },
  createrId: { type: String, requied: true },
  groupId: { type: String, requied: true },
});
const expenseModel = mongoose.model("expense", expanseSchema);

export default expenseModel;
