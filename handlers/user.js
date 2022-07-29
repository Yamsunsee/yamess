import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";
import dotenv from "dotenv";

dotenv.config();

const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env;

export const createToken = {
  accessToken: (user) =>
    jwt.sign(
      {
        id: user.id,
      },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    ),
  refreshToken: (user) =>
    jwt.sign(
      {
        id: user.id,
      },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "30d" }
    ),
};

export const getManyById = async (req, res) => {
  try {
    const { userIdList } = req.query;
    const users = await User.find({ _id: { $in: userIdList } });
    const responseUsers = users.map(({ _id, name }) => ({ _id, name }));
    return res.status(200).json(responseUsers);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const isDuplicatedName = await User.findOne({ name });
    if (isDuplicatedName) {
      return res.status(400).json({ success: false, message: "Username has been taken!" });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      name,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ success: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ success: false, message: "Wrong username!" });
    }
    const isValidPassword = await verify(user.password, password);
    if (isValidPassword) {
      const accessToken = createToken.accessToken(user);
      const refreshToken = createToken.refreshToken(user);
      await User.findOneAndUpdate({ name }, { refreshToken });
      const { password, ...others } = user._doc;
      return res.status(202).json({ ...others, accessToken, refreshToken });
    } else {
      return res.status(400).json({ success: false, message: "Wrong password!" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeName = async (req, res) => {
  try {
    const { newName, userId } = req.body;
    await User.findOneAndUpdate({ _id: userId }, { name: newName }, { new: true });
    return res.status(200).json({ success: true, message: "Change name successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ success: false, message: "Wrong username!" });
    }
    const isValidPassword = await verify(user.password, oldPassword);
    if (isValidPassword) {
      const newHashedPassword = await hash(newPassword);
      await User.findOneAndUpdate({ _id: userId }, { password: newHashedPassword }, { new: true });
      return res.status(200).json({ success: true, message: "Change password successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Wrong password!" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { userId } = req.query;
    await User.findOneAndDelete({ _id: userId });
    return res.status(200).json({ success: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
