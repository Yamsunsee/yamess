import { Router } from "express";
import { getManyById, signIn, signUp, changeName, changePassword, deleteById } from "../handlers/user.js";
import { refreshToken } from "../handlers/refreshToken.js";
import { verifyToken } from "../middlewares/auth.js";

const userRoute = Router();

userRoute.get("/getmanybyid", getManyById);
userRoute.post("/signup", signUp);
userRoute.post("/signin", signIn);
userRoute.post("/changename", changeName);
userRoute.post("/changepassword", changePassword);
userRoute.post("/refreshtoken", refreshToken);
userRoute.delete("/", deleteById);

export default userRoute;
