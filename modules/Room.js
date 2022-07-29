import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    default: "Untitle",
  },
  limit: {
    type: Number,
    default: 2,
  },
  type: {
    type: Boolean,
    default: false,
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  pendingMembers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

export default model("Room", roomSchema);
