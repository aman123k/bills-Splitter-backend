import expenseModel from "../../model/expenseSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const getBalance = async (req, res) => {
  try {
    const id = req.query.id;
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const expenses = await expenseModel.find({
      $and: [
        { groupId: id },
        {
          $or: [
            { "paidBy.email": userDetails.user.email },
            { "splitBetween.email": userDetails.user.email },
          ],
        },
      ],
    });

    let totalReceived = 0;
    let totalOwed = 0;

    for (const expense of expenses) {
      const isPaidByUser = expense.paidBy.email === userDetails?.user?.email;

      for (const person of expense.splitBetween) {
        if (
          isPaidByUser &&
          person?.email !== userDetails?.user?.email &&
          !person?.settlement
        ) {
          totalReceived += person.amount;
        } else if (
          !isPaidByUser &&
          person.email === userDetails?.user?.email &&
          !person?.settlement
        ) {
          totalOwed += person.amount;
        }
      }
    }

    const balance = totalReceived - totalOwed;

    res.status(200).json({
      status: true,
      message: "",
      data: { balance, expenses },
    });
  } catch (err) {
    console.log("error while getting balance", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};
export default getBalance;
