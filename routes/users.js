import { Router } from "express";
import {
  getManyById,
  signUp,
  signIn,
  changeNickname,
  addCurrentRoom,
  removeCurrentRoom,
  addPendingRoom,
  removePendingRoom,
  deleteById,
} from "../modules/User/handler.js";

const userRoute = Router();

userRoute.get("/", getManyById);

userRoute.post("/signUp", signUp);
userRoute.post("/signIn", signIn);

userRoute.patch("/:userId/nickname", changeNickname);
userRoute.patch("/:userId/room/addCurrent", addCurrentRoom);
userRoute.patch("/:userId/room/removeCurrent", removeCurrentRoom);
userRoute.patch("/:userId/room/addPending", addPendingRoom);
userRoute.patch("/:userId/room/removePending", removePendingRoom);

userRoute.delete("/:userId", deleteById);

export default userRoute;
