import { Router } from "express";
import {
  getAll,
  getById,
  create,
  join,
  leave,
  addPendingUser,
  removePendingUser,
  changeName,
  changeType,
  changeLimit,
  changeHost,
  deleteById,
} from "../handlers/room.js";
import { verifyToken } from "../middlewares/auth.js";

const roomRoute = Router();

roomRoute.get("/", getAll);
roomRoute.get("/getbyid", getById);
roomRoute.post("/create", create);
roomRoute.post("/join", join);
roomRoute.post("/leave", leave);
roomRoute.post("/addpendinguser", addPendingUser);
roomRoute.post("/removependinguser", removePendingUser);
roomRoute.post("/changename", changeName);
roomRoute.post("/changetype", changeType);
roomRoute.post("/changelimit", changeLimit);
roomRoute.post("/changehost", changeHost);
roomRoute.delete("/", deleteById);

export default roomRoute;
