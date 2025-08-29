import activityModal from "../../model/activitySchema.js";
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

    const createExpenseDb = expenseModel({
      title: expenseName,
      amount: amount,
      paidBy: paidBy,
      groupId: id,
      splitBetween: splitBetween,
      expenseNote: expenseNote,
      expenseType: expenseType,
      creatorId: userDetails?.user?._id,
    });

    const result = await createExpenseDb.save();

    // Check if payer is also in splitBetween
    const isSamePayer = splitBetween?.some(
      (val) => val.email === paidBy?.email
    );

    // Calculate the adjusted expense count
    const adjustedExpenseCount = isSamePayer
      ? splitBetween.length - 1
      : splitBetween.length;

    // Update group in a single atomic operation
    await groupModel.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          totalExpensesAmount: amount,
          totalExpenses: adjustedExpenseCount,
        },
      },
      { upsert: true, new: true }
    );

    const docs = activityModal({
      message: expenseName,
      expenseId: createExpenseDb?._id,
      groupId: id,
      creatorId: userDetails?.user?._id,
      splitBetween: splitBetween,
      activityType: "expense",
    });
    await docs.save();
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
