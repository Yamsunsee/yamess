import mongoose from "mongoose";
const { Schema, model } = mongoose;

const invitationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
});

export default model("Invitation", invitationSchema);
