import expenseModel from "../../model/expenseSchema.js";
import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const createExpense = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const {
      id,
      expenseName,
      amount,
      paidBy,
      expenseType,
      splitBetween,
      expenseNote,
    } = req.body;

    const currentGroup = await groupModel.findById(id);

    const createExpenseDb = expenseModel({
      title: expenseName,
      amount: amount,
      paidBy: paidBy,
      groupId: currentGroup?._id,
      splitBetween: splitBetween,
      expenseNote: expenseNote,
      expenseType: expenseType,
      creatorId: userDetails?.user?._id,
    });

    const result = await createExpenseDb.save();

    // Update group in a single atomic operation
    await groupModel.findOneAndUpdate(
      { _id: currentGroup?._id },
      {
        $inc: {
          totalExpensesAmount: amount,
          totalExpenses: 1,
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      status: true,
      message: "Expense Created successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Server error",
    });
    console.log("error while creating a expense", err);
  }
};

export default createExpense;
