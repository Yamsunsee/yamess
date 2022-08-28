import Room from "./index";
import User from "../User";
import Message from "../Message";
import Invitation from "../Invitation";

export const getAll = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: rooms });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const getJoinedMembers = async (req, res) => {
  try {
    const { roomId } = req.params;
    const members = await User.find({ currentRoomId: roomId }, "nickname");
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: members });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const getPendingMembers = async (req, res) => {
  try {
    const { roomId } = req.params;
    const members = await User.find({ pendingRoomId: roomId }, "nickname");
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: members });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { userId, name, isPrivate, limit } = req.body;
    const newRoom = new Room({
      name,
      limit,
      isPrivate,
      host: userId,
    });
    await newRoom.save();
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: newRoom });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changeName = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { name });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changeType = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { isPrivate } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { isPrivate });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changeLimit = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { limit });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const changeHost = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { host } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { host });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { roomId } = req.params;
    await Room.findOneAndDelete({ _id: roomId });
    await Message.deleteMany({ roomId });
    await Invitation.deleteMany({ roomId });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};
