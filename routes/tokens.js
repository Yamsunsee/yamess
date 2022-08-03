import { Router } from "express";
import { refreshToken } from "../handlers/refreshToken.js";

const tokenRoute = Router();

tokenRoute.get("/:userId", refreshToken);

export default tokenRoute;
