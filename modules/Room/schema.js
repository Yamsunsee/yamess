import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    default: "Untitle",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 2,
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Room", roomSchema);
