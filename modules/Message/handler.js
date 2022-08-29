import Message from "./schema.js";

export const getByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).populate([{ path: "userId", select: "nickname" }]);
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: messages });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { content, userId, roomId } = req.body;
    const message = new Message({
      content,
      userId,
      roomId,
    });
    await message.save();
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};
