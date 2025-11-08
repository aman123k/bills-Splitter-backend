import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const getUserInfo = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    res.status(200).json({
      status: true,
      message: "",
      data: userDetails.user,
    });
  } catch {
    res.status(400).json({
      status: false,
      message: MESSAGES.SERVER_ERROR,
    });
  }
};
export default getUserInfo;
