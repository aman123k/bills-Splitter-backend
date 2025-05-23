import groupModel from "../../model/groupSchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const getGropus = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const groups = await groupModel
      .find({
        $or: [
          { createrId: userDetais.user.email },
          { "member.email": userDetais.user.email },
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
      message: "Somthing is worng",
    });
  }
};

export default getGropus;
