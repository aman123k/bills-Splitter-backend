import activityModal from "../../model/activitySchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const getAllActivities = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!userDetails)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const allActivities = await activityModal
      .find({
        $or: [
          { creatorId: userDetails.user._id },
          { "splitBetween.email": userDetails?.user?.email },
        ],
      })
      .select("-creatorId ")
      .populate([
        { path: "expenseId", select: "paidBy amount" },
        { path: "groupId", select: "groupName" },
      ]);

    res.status(200).json({
      status: true,
      message: "",
      data: allActivities,
    });
  } catch (err) {
    console.log("error while getting a all bills", err);
    res.status(400).json({
      status: false,
      message: "Something is wrong",
    });
  }
};
export default getAllActivities;
