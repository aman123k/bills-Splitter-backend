import expenseModel from "../../model/expenseSchema.js";
import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const deleteExpense = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const id = req.query.expenseId;
    const currentExpense = await expenseModel.findById(id);
    const deleteExpenses = await expenseModel.findByIdAndDelete(id);
    const currentGroup = await groupModel.findById(currentExpense.groupId);

    // Proceed only if currentGroup exists and has a totalExpensesAmount greater than 0
    if (currentGroup?.totalExpensesAmount > 0) {
      await groupModel.findOneAndUpdate(
        { _id: currentExpense.groupId },
        {
          $inc: {
            totalExpensesAmount: -currentExpense.amount,
            totalExpenses: -1,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.log("error while deleting an expense", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};

export default deleteExpense;
