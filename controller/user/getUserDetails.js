import { verifyToken } from "../../token/jwtToken.js";

const getUserInfo = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    res.status(200).json({
      status: true,
      message: "",
      data: userDetais.user,
    });
  } catch {
    res.status(400).json({
      status: false,
      message: "Server error",
    });
  }
};
export default getUserInfo;
