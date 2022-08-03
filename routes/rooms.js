import { Router } from "express";
import {
  getAll,
  getById,
  create,
  join,
  leave,
  addPendingMember,
  removePendingMember,
  addInvitedMember,
  removeInvitedMember,
  changeName,
  changeType,
  changeLimit,
  deleteById,
} from "../handlers/room.js";
import { verifyToken } from "../middlewares/auth.js";

const roomRoute = Router();

roomRoute.get("/", getAll);
roomRoute.get("/:roomId", getById);

roomRoute.post("/:roomId/create", create);

roomRoute.patch("/:roomId/join", join);
roomRoute.patch("/:roomId/leave", leave);
roomRoute.patch("/:roomId/pending/add", addPendingMember);
roomRoute.patch("/:roomId/pending/remove", removePendingMember);
roomRoute.patch("/:roomId/invite/add", addInvitedMember);
roomRoute.patch("/:roomId/invite/remove", removeInvitedMember);
roomRoute.patch("/:roomId/name", changeName);
roomRoute.patch("/:roomId/type", changeType);
roomRoute.patch("/:roomId/limit", changeLimit);

roomRoute.delete("/:roomId", deleteById);

export default roomRoute;
