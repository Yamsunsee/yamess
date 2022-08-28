import { Router } from "express";
import { create, deleteById } from "../modules/Invitation/handler";

const invitationRoute = Router();

invitationRoute.get("/create", create);

invitationRoute.delete("/:roomId/:userId", deleteById);

export default invitationRoute;
