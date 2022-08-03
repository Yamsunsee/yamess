import { Router } from "express";
import {
  getManyById,
  getInvitedRoom,
  signIn,
  signUp,
  changeNickname,
  changePassword,
  deleteById,
} from "../handlers/user.js";
import { verifyToken } from "../middlewares/auth.js";

const userRoute = Router();

userRoute.get("/", getManyById);
userRoute.get("/:userId/invite", getInvitedRoom);

userRoute.post("/signUp", signUp);
userRoute.post("/signIn", signIn);

userRoute.patch("/:userId/nickname", changeNickname);
userRoute.patch("/:userId/password", changePassword);

userRoute.delete("/:userId", deleteById);

export default userRoute;
