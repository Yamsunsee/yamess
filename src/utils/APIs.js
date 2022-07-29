export const host = "http://localhost:5000";

// Users
const users = `${host}/users/`;
export const usersRoute = {
  getManyById: users + "getmanybyid",
  signUp: users + "signup",
  signIn: users + "signin",
  changeName: users + "changename",
  changePassword: users + "changepassword",
  deleteById: users,
};

// Rooms
const rooms = `${host}/rooms/`;
export const roomsRoute = {
  getAll: rooms,
  getById: rooms + "getbyid",
  create: rooms + "create",
  join: rooms + "join",
  leave: rooms + "leave",
  addPendingUser: rooms + "addpendinguser",
  removePendingUser: rooms + "removependinguser",
  changeName: rooms + "changename",
  changeType: rooms + "changetype",
  changeLimit: rooms + "changelimit",
  deleteById: rooms,
};

// Messages
const messages = `${host}/messages`;
export const messagesRoute = {
  getByRoomId: messages,
  create: messages,
};
