import mongoose from "mongoose"
const { Schema, model } = mongoose

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true }
)

export default model("Message", messageSchema)
