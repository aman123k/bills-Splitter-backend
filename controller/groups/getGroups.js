import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const getGroups = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: MESSAGES.TOKEN_NOT_FOUND,
      });
    const groups = await groupModel
      .find({
        $or: [
          { creatorId: userDetails.user._id },
          {
            "members.email": {
              $regex: new RegExp(`^${userDetails.user.email}$`, "i"),
            },
          },
        ],
      })
      .sort({ time: -1 });
    res.status(200).json({
      status: true,
      message: "",
      data: groups,
    });
  } catch (err) {
    console.log("error while getting a groups", err);
    res.status(400).json({
      status: false,
      message: MESSAGES.SOMETHING_WRONG,
    });
  }
};

export default getGroups;
