import { verifyToken } from "../../token/jwtToken.js";

const logOutUser = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    if (userDetais) {
      res.cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now()),
        sameSite: "none",
      });
      res.status(200).json({
        status: true,
        message: "User logOut",
      });
    }
  } catch {
    res.status(400).json({
      status: false,
      message: "Please logIn",
    });
  }
};
export default logOutUser;
