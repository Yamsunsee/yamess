let users = []
let sockets = []

const onlineUsers = {
  add: (userId, socketId) => {
    sockets.push({ socketId, userId })
    // console.log(sockets)
    users = Array.from(new Set(sockets.map((socket) => socket.userId)))
  },
  remove: (socketId) => {
    // console.log(sockets)
    sockets = sockets.filter((socket) => socket.socketId !== socketId)
    users = Array.from(new Set(sockets.map((socket) => socket.userId)))
  },
}

export default (io) => {
  io.of("users").on("connection", (socket) => {
    socket.on("join-lobby", ({ userId }) => {
      onlineUsers.add(userId, socket.id)
      io.of("users").emit("lobby", users)
    })
    socket.on("leave-lobby", () => {
      onlineUsers.remove(socket.id)
      io.of("users").emit("lobby", users)
    })
    socket.on("disconnect", () => {
      onlineUsers.remove(socket.id)
      io.of("users").emit("lobby", users)
    })
  })
  io.of("rooms").on("connection", (socket) => {
    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId)
      io.of("rooms").emit("room", users)
    })
    socket.on("leave-room", () => {
      io.of("rooms").emit("room")
    })
    socket.on("send-message", ({ roomId }) => {
      io.of("rooms").to(roomId).emit("message")
    })
    socket.on("disconnect", () => {
      io.of("room").emit("room")
    })
  })
}
