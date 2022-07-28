import jwt from "jsonwebtoken";
import { createToken } from "./user.js";
import User from "../modules/User.js";
import dotenv from "dotenv";

dotenv.config();

const { REFRESH_TOKEN_SECRET_KEY } = process.env;

export const refreshToken = (req, res) => {
  try {
    const token = req.headers.authorization;
    const refreshToken = token.split(" ").pop();
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, async (error, decodedUser) => {
      const user = await User.findOne({ _id: decodedUser.id });
      const isValidRefreshToken = user.refreshToken === refreshToken;
      if (error || !isValidRefreshToken) {
        return res.status(403).json({ success: false, message: "Token is invalid!" });
      }
      const newAccessToken = createToken.accessToken(user);
      const newRefreshToken = createToken.refreshToken(user);
      await User.findOneAndUpdate({ _id: decodedUser.id }, { refreshToken: newRefreshToken }, { new: true });
      return res.status(201).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "You are not authorized!" });
  }
};
