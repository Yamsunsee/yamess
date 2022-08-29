import { Router } from "express";
import { getAllById, create, deleteById } from "../modules/Invitation/handler.js";

const invitationRoute = Router();

invitationRoute.get("/:userId", getAllById);

invitationRoute.post("/create", create);

invitationRoute.delete("/:roomId/:userId", deleteById);

export default invitationRoute;
