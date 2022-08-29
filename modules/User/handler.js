import argon2 from "argon2";
import dotenv from "dotenv";
import User from "./schema.js";

dotenv.config();
const { hash, verify } = argon2;

export const getManyById = async (req, res) => {
  try {
    const { userIdList } = req.query;
    const users = await User.find({ _id: { $in: userIdList } }, "nickname");
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: users });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const isDuplicatedName = await User.findOne({ name });
    if (isDuplicatedName) {
      return res.status(400).json({ isSuccess: false, message: "Username has been taken!" });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      name,
      nickname: name,
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
      const { password, name, ...others } = user._doc;
      return res.status(200).json({ isSuccess: true, message: "Successfully!", data: others });
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

export const addCurrentRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId } = req.body;
    await User.findOneAndUpdate({ _id: userId }, { currentRoomId: roomId });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const removeCurrentRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndUpdate({ _id: userId }, { currentRoomId: null });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const addPendingRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId } = req.body;
    await User.findOneAndUpdate({ _id: userId }, { pendingRoomId: roomId });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const removePendingRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndUpdate({ _id: userId }, { pendingRoomId: null });
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
