import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

export default model("User", userSchema);
