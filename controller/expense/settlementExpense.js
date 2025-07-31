import expenseModel from "../../model/expenseSchema.js";
import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const settlementExpense = async (req, res) => {
  try {
    const id = req.query.expenseId;
    const { email, groupId } = req.body;

    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const settlementExpense = await expenseModel.findOneAndUpdate(
      {
        $and: [
          { _id: id },
          {
            "splitBetween.email": email,
          },
        ],
      },
      { $set: { "splitBetween.$.settlement": true } },
      { returnDocument: "after" }
    );
    const amount = settlementExpense?.splitBetween.find(
      (item) => item.email === email
    ).amount;

    await settlementExpense.save();
    // Update group in a single atomic operation
    await groupModel.findOneAndUpdate(
      { _id: groupId },
      {
        $inc: {
          totalExpensesAmount: -amount,
          totalSettledExpenses: 1,
        },
      },
      { upsert: true, new: true }
    );
    res.status(200).json({
      status: true,
      message: "Payment settled successfully",
    });
  } catch (err) {
    console.log("error while setting an expenses", err);
    res.status(400).json({
      status: false,
      message: "Something is wrong",
    });
  }
};
export default settlementExpense;
