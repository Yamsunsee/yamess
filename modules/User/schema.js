import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  currentRoomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  pendingRoomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
});

export default model("User", userSchema);
