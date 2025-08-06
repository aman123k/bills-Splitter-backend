import expenseModel from "../../model/expenseSchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const getExpenses = async (req, res) => {
  try {
    const id = req.query.id;
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!userDetails)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const expenses = await expenseModel
      .find({
        groupId: id,
      })
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "",
      data: expenses,
    });
  } catch (err) {
    console.log("error while getting a expenses", err);
    res.status(400).json({
      status: false,
      message: "Something is wrong",
    });
  }
};

export default getExpenses;
