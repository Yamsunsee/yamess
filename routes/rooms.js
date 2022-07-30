import { Router } from "express";
import {
  getAll,
  getById,
  getInvited,
  create,
  join,
  leave,
  addPendingUser,
  removePendingUser,
  addInvitedUser,
  removeInvitedUser,
  changeName,
  changeType,
  changeLimit,
  deleteById,
} from "../handlers/room.js";
import { verifyToken } from "../middlewares/auth.js";

const roomRoute = Router();

roomRoute.get("/", getAll);
roomRoute.get("/getbyid", getById);
roomRoute.get("/getinvited", getInvited);
roomRoute.post("/create", create);
roomRoute.post("/join", join);
roomRoute.post("/leave", leave);
roomRoute.post("/addpendinguser", addPendingUser);
roomRoute.post("/removependinguser", removePendingUser);
roomRoute.post("/addinviteduser", addInvitedUser);
roomRoute.post("/removeinviteduser", removeInvitedUser);
roomRoute.post("/changename", changeName);
roomRoute.post("/changetype", changeType);
roomRoute.post("/changelimit", changeLimit);
roomRoute.delete("/", deleteById);

export default roomRoute;
