import expenseModel from "../../model/expenseSchema.js";
import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const deleteGroup = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const id = req.query.id;

    const deleteGroup = await groupModel.findByIdAndDelete(id);
    const deleteExpenses = await expenseModel.deleteMany({
      groupId: id,
    });

    if (deleteExpenses?.deletedCount != 0 && deleteGroup) {
      res.status(200).json({
        status: true,
        message: "Group & Expense deleted successfully",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Group deleted successfully",
      });
    }
  } catch (err) {
    console.log("error while deleting a group", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};
export default deleteGroup;
