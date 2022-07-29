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
    socket.on("join-lobby", ({ userId }) => {
      onlineUsers.add(userId, socket.id);
      io.emit("users-change", users);
    });
    socket.on("leave-lobby", () => {
      onlineUsers.remove(socket.id);
      io.emit("users-change", users);
    });
    socket.on("join-room", ({ userId, roomId }) => {
      onlineUsers.add(userId, socket.id);
      socket.join(roomId);
      io.emit("rooms-change", users);
    });
    socket.on("leave-room", () => {
      onlineUsers.remove(socket.id);
      io.emit("rooms-change", users);
    });
    socket.on("handle-request", () => {
      io.emit("rooms-change", users);
    });
    socket.on("accept-request", (data) => {
      io.emit("request", data);
    });
    socket.on("send-message", ({ roomId }) => {
      io.to(roomId).emit("messages-change");
    });
    socket.on("disconnect", () => {
      onlineUsers.remove(socket.id);
      io.emit("users-change", users);
    });
  });
};
