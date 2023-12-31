import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "../token/jwtToken.js";

class userController {
  static userRegister = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const docs = new userModel({
        name: name,
        email: email,
        password: hashPassword,
      });
      const result = await docs.save();
      res.status(201).json({
        success: true,
        response: "User Register Successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        response: "Email shoud be Unique",
      });
    }
  };

  static userLogIn = async (req, res) => {
    const { email, password } = req.body;
    const userDetais = await userModel.findOne({ email: email });
    if (!userDetais) {
      return res.status(400).json({
        success: false,
        response: "User Does't Exsit",
      });
    }
    const dbPassword = userDetais.password;
    const comparePass = await bcrypt.compare(password, dbPassword);
    if (comparePass) {
      const accessToken = createToken(userDetais);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      res.status(200).json({
        success: true,
        response: "User Loged In",
        data: accessToken,
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Password does't match",
      });
    }
  };
  static getUserInfo = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      res.status(200).json({
        success: true,
        response: userDetais.user,
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "Please logIn",
        navigator: "/login",
      });
    }
  };

  static userLogOut = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      if (userDetais) {
        res.cookie("accessToken", "", {
          httpOnly: true,
          secure: true,
          path: "/",
          expires: new Date(Date.now()),
          sameSite: "none",
        });
        res.status(200).json({
          success: true,
          response: "User logOut",
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        response: "Please logIn",
        navigator: "/login",
      });
    }
  };
}
export default userController;
