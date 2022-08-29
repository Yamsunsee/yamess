import Invitation from "./schema.js";

export const getAllById = async (req, res) => {
  try {
    const { userId } = req.params;
    const invitations = await Invitation.find({ userId });
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: invitations });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { userId, roomId } = req.body;
    const invitation = new Invitation({
      userId,
      roomId,
    });
    await invitation.save();
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { userId, roomId } = req.params;
    await Invitation.findOneAndDelete({ userId, roomId });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};
