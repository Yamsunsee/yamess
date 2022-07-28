import Room from "../modules/Room.js";

export const getAll = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { roomId } = req.query;
    const rooms = await Room.findOne({ _id: roomId }).populate("members", "name");
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { userId, name, type, limit } = req.body;
    const newRoom = new Room({
      name,
      limit,
      type,
      host: userId,
      members: [userId],
    });
    await newRoom.save();
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const join = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { $addToSet: { members: userId } }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const leave = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { $pull: { members: userId } }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addPendingUser = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const newRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { pendingMembers: userId } },
      { new: true }
    );
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removePendingUser = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { $pull: { pendingMembers: userId } }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeName = async (req, res) => {
  try {
    const { roomId, newName } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { name: newName }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeType = async (req, res) => {
  try {
    const { roomId, newType } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { type: newType }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeLimit = async (req, res) => {
  try {
    const { roomId, newLimit } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { limit: newLimit }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeHost = async (req, res) => {
  try {
    const { roomId, newHost } = req.body;
    const newRoom = await Room.findOneAndUpdate({ _id: roomId }, { host: newHost }, { new: true });
    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { roomId } = req.query;
    await Room.findByIdAndDelete(roomId);
    return res.status(200).json({ success: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
