import Room from "../modules/Room.js";
import Message from "../modules/Message.js";

export const getAll = async (req, res) => {
  try {
    const rooms = await Room.find({}, "name isPrivate limit members");
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const rooms = await Room.findOne({ _id: roomId }).populate([
      { path: "members", select: "name" },
      { path: "pendingMembers", select: "name" },
    ]);
    return res.status(200).json(rooms);
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
      members: [userId],
    });
    await newRoom.save();
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const join = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $addToSet: { members: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const leave = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $pull: { members: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const addPendingMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $addToSet: { pendingMembers: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const removePendingMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $pull: { pendingMembers: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const addInvitedMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $addToSet: { invitedMembers: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const removeInvitedMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    await Room.findOneAndUpdate({ _id: roomId }, { $pull: { invitedMembers: userId } });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
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

export const deleteById = async (req, res) => {
  try {
    const { roomId } = req.params;
    await Room.findByIdAndDelete(roomId);
    await Message.deleteMany({ roomId });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};
