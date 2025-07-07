import bcrypt from "bcrypt";
import userModel from "../../model/userSchema.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user is already exist
    const existUser = await userModel.findOne({ email: email });

    if (existUser) {
      return res.status(400).json({
        status: false,
        message: `User exists. Please log in with ${existUser?.loginWith}`,
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
        message: "User register successfullyy.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Server error",
    });
    console.log("error while register user with password", error);
  }
};

export default registerUser;
