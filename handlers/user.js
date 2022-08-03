import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
import User from "../modules/User.js";
import Room from "../modules/Room.js";
import dotenv from "dotenv";

dotenv.config();

const { hash, verify } = argon2;
const { sign } = jsonwebtoken;
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env;

export const createToken = {
  accessToken: ({ id }) =>
    sign(
      {
        id,
      },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    ),
  refreshToken: ({ id }) =>
    sign(
      {
        id,
      },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "30d" }
    ),
};

export const getManyById = async (req, res) => {
  try {
    const { userIdList } = req.query;
    const users = await User.find({ _id: { $in: userIdList } }, "nickname");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const getInvitedRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    const rooms = await Room.find({ invitedMembers: { $all: [userId] } }, "name");
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const isDuplicatedName = await User.findOne({ name });
    if (isDuplicatedName) {
      return res.status(400).json({ isisSuccess: false, message: "Username has been taken!" });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      name,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ isSuccess: false, message: "Wrong username!" });
    }
    const isValidPassword = await verify(user.password, password);
    if (isValidPassword) {
      const accessToken = createToken.accessToken(user);
      const refreshToken = createToken.refreshToken(user);
      const newUser = await User.findOneAndUpdate({ name }, { refreshToken }, { new: true });
      const { password, ...others } = newUser._doc;
      return res.status(200).json({ ...others, accessToken });
    } else {
      return res.status(400).json({ isSuccess: false, message: "Wrong password!" });
    }
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changeNickname = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nickname } = req.body;
    await User.findOneAndUpdate({ _id: userId }, { nickname });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const hashedPassword = await hash(password);
    await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndDelete({ _id: userId });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};
