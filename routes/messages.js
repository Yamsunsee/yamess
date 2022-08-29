import { Router } from "express";
import { getByRoomId, create } from "../modules/Message/handler.js";

const messageRoute = Router();

messageRoute.get("/:roomId", getByRoomId);

messageRoute.post("/create", create);

export default messageRoute;
