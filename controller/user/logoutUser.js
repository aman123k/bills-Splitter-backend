import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const logOutUser = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (userDetails) {
      res.cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now()),
        sameSite: "none",
      });
      res.status(200).json({
        status: true,
        message: MESSAGES.USER_LOGGED_OUT,
      });
    }
  } catch {
    res.status(400).json({
      status: false,
      message: MESSAGES.PLEASE_LOGIN,
    });
  }
};
export default logOutUser;
