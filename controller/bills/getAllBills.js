import expenseModel from "../../model/expenseSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const getAllBills = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!userDetails)
      return res.status(400).json({
        success: false,
        response: MESSAGES.TOKEN_NOT_FOUND,
      });
    const allBills = await expenseModel
      .find({
        $or: [
          { "paidBy.email": userDetails.user.email },
          { "splitBetween.email": userDetails.user.email },
        ],
      })
      .select("-creatorId -expenseType -createdAt -expenseNote")
      .populate("groupId", "groupName");

    let totalOwed = 0;
    let totalOwe = 0;

    for (const allBill of allBills) {
      const isPaidByUser = allBill.paidBy.email === userDetails?.user?.email;

      for (const person of allBill.splitBetween) {
        if (
          isPaidByUser &&
          person?.email !== userDetails?.user?.email &&
          !person?.settlement
        ) {
          totalOwed += person.amount;
        } else if (
          !isPaidByUser &&
          person.email === userDetails?.user?.email &&
          !person?.settlement
        ) {
          totalOwe += person.amount;
        }
      }
    }
    const balance = totalOwed - totalOwe;

    res.status(200).json({
      status: true,
      message: "",
      data: { totalOwed, totalOwe, balance, allBills },
    });
  } catch (err) {
    console.log("error while getting a all bills", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};

export default getAllBills;
