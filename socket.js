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
      io.emit("users", users);
    });
    socket.on("leave-lobby", () => {
      onlineUsers.remove(socket.id);
      io.emit("users", users);
    });
    socket.on("join-room", ({ userId, roomId }) => {
      onlineUsers.add(userId, socket.id);
      socket.join(roomId);
      io.emit("rooms", users);
    });
    socket.on("leave-room", () => {
      onlineUsers.remove(socket.id);
      io.emit("rooms", users);
    });
    socket.on("send-message", ({ roomId }) => {
      io.to(roomId).emit("messages");
    });
    socket.on("disconnect", () => {
      onlineUsers.remove(socket.id);
      io.emit("users", users);
    });
  });
  // io.of("rooms").on("connection", (socket) => {
  //   socket.on("join-room", ({ roomId }) => {
  //     socket.join(roomId);
  //     io.of("rooms").emit("room", users);
  //   });
  //   socket.on("leave-room", () => {
  //     io.of("rooms").emit("room");
  //   });
  //   socket.on("send-message", ({ roomId }) => {
  //     io.of("rooms").to(roomId).emit("message");
  //   });
  //   socket.on("disconnect", () => {
  //     io.of("room").emit("room");
  //   });
  // });
};
