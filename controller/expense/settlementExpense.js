import activityModal from "../../model/activitySchema.js";
import expenseModel from "../../model/expenseSchema.js";
import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

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
    const docs = activityModal({
      message: `${userDetails?.user?.name} paid`,
      expenseId: settlementExpense?._id,
      groupId: groupId,
      creatorId: userDetails?.user?._id,
      splitBetween: settlementExpense?.splitBetween,
      activityType: "paid",
    });

    await docs.save();
    res.status(200).json({
      status: true,
      message: MESSAGES.PAYMENT_SETTLED,
    });
  } catch (err) {
    console.log("error while setting an expenses", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};
export default settlementExpense;
