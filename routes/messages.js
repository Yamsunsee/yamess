import { Router } from "express";
import { create, getByRoomId } from "../handlers/message.js";
import { verifyToken } from "../middlewares/auth.js";

const messageRoute = Router();

messageRoute.get("/:roomId", getByRoomId);
messageRoute.post("/", create);

export default messageRoute;
