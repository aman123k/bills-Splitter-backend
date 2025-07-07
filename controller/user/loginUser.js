import bcrypt from "bcrypt";
import userModel from "../../model/userSchema.js";
import { createToken } from "../../token/jwtToken.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user
    const existUser = await userModel.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "User does't exsit.Please register",
      });
    }
    // Check user password
    const dbPassword = existUser.password;
    const comparePass = await bcrypt.compare(password, dbPassword);

    if (comparePass) {
      const accessToken = createToken(existUser);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      res.status(200).json({
        status: true,
        message: "User logged in successfullyy.",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Password does't match",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Server error",
    });
    console.log("error while login user with password", error);
  }
};

export default loginUser;
