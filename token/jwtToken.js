import dotenv from "dotenv";
dotenv.config();
import Jwt from "jsonwebtoken";
const secreteKey = process.env.SecreteKey;

const createToken = (user) => {
  const accessToken = Jwt.sign({ user }, secreteKey);
  return accessToken;
};
const verifyToken = (token) => {
  if (!token) return null;
  try {
    const userDetails = Jwt.verify(token, secreteKey);
    return userDetails;
  } catch {
    return null;
  }
};
export { createToken, verifyToken };
