import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/users.js";
import roomRoute from "./routes/rooms.js";
import messageRoute from "./routes/messages.js";
import socket from "./socket.js";
import { refreshToken } from "./handlers/refreshToken.js";

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
const { connect } = mongoose;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/users", userRoute);
app.use("/rooms", roomRoute);
app.use("/messages", messageRoute);
app.get("/refreshtoken", refreshToken);

const connectDatabase = async () => {
  try {
    await connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectDatabase();
});

socket(io);
