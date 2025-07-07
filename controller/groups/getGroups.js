import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const getGroups = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const groups = await groupModel
      .find({
        $or: [
          { creatorId: userDetails.user.email },
          { "member.email": userDetails.user.email },
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
      message: "Something is wrong",
    });
  }
};

export default getGroups;
