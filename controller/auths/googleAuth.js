import fetch from "node-fetch";
import userModel from "../../model/userSchema.js";
import { createToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const GoogleAuth = async (req, res) => {
  try {
    const { tokenResponse } = req.body;
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse}`
    );
    const json = await response.json();
    const existUser = await userModel.findOne({ email: json?.email });

    if (existUser) {
      if (existUser?.loginWith !== "google") {
        return res.status(400).json({
          status: false,
          message: `${MESSAGES.USER_EXISTS_LOGIN_WITH} ${existUser?.loginWith}`,
        });
      }

      const accessToken = createToken(existUser);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      return res.status(200).json({
        status: true,
        message: MESSAGES.USER_LOGGED_IN,
      });
    }

    const docs = new userModel({
      name: json?.name,
      email: json?.email,
      password: "",
      loginWith: "google",
    });
    const result = await docs.save();

    const accessToken = createToken(result);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "none",
    });

    res.status(200).json({
      status: true,
      message: MESSAGES.USER_REGISTERED,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: MESSAGES.SERVER_ERROR,
    });
    console.log("error while authenticate with google", err);
  }
};

export default GoogleAuth;
