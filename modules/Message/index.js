import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
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
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
