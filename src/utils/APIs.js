export const host = "https://yamess-backend.herokuapp.com";

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
  getInvited: rooms + "getinvited",
  create: rooms + "create",
  join: rooms + "join",
  leave: rooms + "leave",
  addPendingUser: rooms + "addpendinguser",
  removePendingUser: rooms + "removependinguser",
  addInvitedUser: rooms + "addinviteduser",
  removeInvitedUser: rooms + "removeinviteduser",
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

// Token
export const tokenRoute = host + "/refreshtoken";
