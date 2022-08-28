let users = [];
let sockets = [];

const onlineUsers = {
  add: (userId, socketId) => {
    sockets.push({ socketId, userId });
    users = Array.from(new Set(sockets.map((socket) => socket.userId)));
  },
  remove: (socketId) => {
    sockets = sockets.filter((socket) => socket.socketId !== socketId);
    users = Array.from(new Set(sockets.map((socket) => socket.userId)));
  },
};

export default (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      onlineUsers.add(userId, socket.id);
      io.emit("users", users);
    });

    socket.on("leave", () => {
      onlineUsers.remove(socket.id);
      io.emit("users", users);
    });

    socket.on("create-room", () => {
      socket.broadcast.emit("rooms");
    });

    socket.on("leave-room", () => {
      socket.broadcast.emit("rooms");
    });

    socket.on("delete-room", (roomId) => {
      socket.broadcast.emit("delete-room", roomId);
      socket.broadcast.emit("rooms");
    });

    socket.on("request", (data) => {
      socket.broadcast.emit("request", data);
    });

    socket.on("accept-request", (data) => {
      socket.broadcast.emit("response", { ...data, isAccept: true });
    });

    socket.on("decline-request", (data) => {
      socket.broadcast.emit("response", { ...data, isAccept: false });
    });

    socket.on("disconnect", () => {
      onlineUsers.remove(socket.id);
      io.emit("users", users);
    });
  });
};
