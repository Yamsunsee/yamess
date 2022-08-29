import { Router } from "express";
import {
  getAll,
  getJoinedMembers,
  getPendingMembers,
  create,
  changeName,
  changeType,
  changeLimit,
  changeHost,
  deleteById,
} from "../modules/Room/handler.js";

const roomRoute = Router();

roomRoute.get("/", getAll);
roomRoute.get("/:roomId/joined", getJoinedMembers);
roomRoute.get("/:roomId/pending", getPendingMembers);

roomRoute.post("/create", create);

roomRoute.patch("/:roomId/name", changeName);
roomRoute.patch("/:roomId/type", changeType);
roomRoute.patch("/:roomId/limit", changeLimit);
roomRoute.patch("/:roomId/host", changeHost);

roomRoute.delete("/:roomId", deleteById);

export default roomRoute;
