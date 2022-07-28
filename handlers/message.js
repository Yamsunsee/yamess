import Message from "../modules/Message.js"

export const getByRoomId = async (req, res) => {
  try {
    const { roomId } = req.query
    const messages = await Message.find({ roomId }).populate("userId", "name")
    return res.status(200).json(messages)
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const create = async (req, res) => {
  try {
    const { content, userId, roomId } = req.body
    const message = new Message({
      content,
      userId,
      roomId,
    })
    await message.save()
    return res.status(200).json(message)
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}
