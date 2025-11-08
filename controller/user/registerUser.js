import bcrypt from "bcrypt";
import userModel from "../../model/userSchema.js";
import MESSAGES from "../../variable/variable.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user is already exist
    const existUser = await userModel.findOne({ email: email });

    if (existUser) {
      return res.status(400).json({
        status: false,
        message: `${MESSAGES.USER_EXISTS_LOGIN_WITH} ${existUser?.loginWith}`,
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const docs = new userModel({
        name: name,
        email: email,
        password: hashPassword,
        loginWith: "password",
      });
      const result = await docs.save();
      res.status(201).json({
        status: true,
        message: MESSAGES.USER_REGISTERED,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: MESSAGES.SERVER_ERROR,
    });
    console.log("error while register user with password", error);
  }
};

export default registerUser;
