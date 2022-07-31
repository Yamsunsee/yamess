import jwt from "jsonwebtoken";
import { createToken } from "./user.js";
import User from "../modules/User.js";
import dotenv from "dotenv";

dotenv.config();

const { REFRESH_TOKEN_SECRET_KEY } = process.env;

export const refreshToken = (req, res) => {
  try {
    const { userId } = req.query;
    const token = req.headers.authorization;
    const refreshToken = token.split(" ").pop();
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, async (error, decodedUser) => {
      const user = await User.findOne({ _id: userId });
      const isValidRefreshToken = user.refreshToken === refreshToken && userId === decodedUser.id;
      if (error || !isValidRefreshToken) {
        return res.status(403).json({ success: false, message: "Token is invalid!" });
      }
      const newAccessToken = createToken.accessToken(user);
      const newRefreshToken = createToken.refreshToken(user);
      const newUser = await User.findOneAndUpdate({ _id: userId }, { refreshToken: newRefreshToken }, { new: true });
      const { password, ...others } = newUser._doc;
      return res.status(201).json({ accessToken: newAccessToken, ...others });
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "You are not authorized!" });
  }
};
