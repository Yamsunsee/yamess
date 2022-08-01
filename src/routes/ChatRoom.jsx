import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";

import { usersRoute, roomsRoute, messagesRoute } from "../utils/APIs.js";

import Message from "../components/Message.jsx";
import User from "../components/User.jsx";
import PendingUser from "../components/PendingUser.jsx";
import PendingRoom from "../components/PendingRoom.jsx";
import PendingMessage from "../components/PendingMessage.jsx";

const ChatRoom = () => {
  const navigate = useNavigate();
  const socket = useMemo(() => io("https://yamess-backend.herokuapp.com", { transports: ["websocket"] }), []);
  const [name, setName] = useState("Untitle");
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [invitedRooms, setInvitedRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [idleUsers, setIdleUsers] = useState([]);
  const [isRoomsChange, setIsRoomsChange] = useState(true);
  const [isMessagesChange, setIsMessagesChange] = useState(true);
  const input = useRef();
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const storageRoom = useMemo(() => {
    const room = localStorage.getItem("yamess-room");
    if (room) return JSON.parse(room);
  }, [isRoomsChange]);

  useEffect(() => {
    if (storageRoom) {
      setName(storageRoom.name);
    } else navigate("/yamess");
  }, [isRoomsChange]);

  useEffect(() => {
    if (storageUser && storageRoom) socket.emit("join-room", { roomId: storageRoom._id, userId: storageUser._id });
  }, []);

  useEffect(() => {
    if (storageRoom) fetchMessages();
  }, []);

  useEffect(() => {
    if (isMessagesChange) fetchMessages();
  }, [isMessagesChange]);

  useEffect(() => {
    if (isRoomsChange && storageRoom) fetchRoom();
  }, [isRoomsChange]);

  useEffect(() => {
    const newIdleUsers = onlineUsers.filter((onlineUser) =>
      joinedUsers.every((joinedUser) => joinedUser.name !== onlineUser.name)
    );
    setIdleUsers(newIdleUsers);
  }, [onlineUsers, joinedUsers]);

  useEffect(() => {
    socket.on("messages-change", () => {
      setIsMessagesChange(true);
    });
    socket.on("rooms-change", (users) => {
      fetchOnlineUsers(users);
      setIsRoomsChange(true);
    });
    socket.on("users-change", (users) => {
      fetchOnlineUsers(users);
      setIsRoomsChange(true);
    });
  }, [socket]);

  const fetchOnlineUsers = async (userIdList) => {
    const { accessToken } = storageUser;
    try {
      const { data } = await axios.get(usersRoute.getManyById, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userIdList,
        },
      });
      setOnlineUsers(data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fetchRoom = async () => {
    const { accessToken, _id: userId } = storageUser;
    const { _id: roomId } = storageRoom;
    try {
      const { data } = await axios.get(roomsRoute.getById, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      });
      const invitedRooms = await axios.get(roomsRoute.getInvited, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId,
        },
      });
      setJoinedUsers(data.members);
      setPendingUsers(data.pendingMembers);
      setInvitedUsers(data.invitedMembers);
      setInvitedRooms(invitedRooms.data);
      setIsRoomsChange(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fetchMessages = async () => {
    const { accessToken } = storageUser;
    const { _id: roomId } = storageRoom;
    try {
      const { data } = await axios.get(messagesRoute.getByRoomId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      });
      setPendingMessages([]);
      setMessages(data.reverse());
      setIsMessagesChange(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { content } = Object.fromEntries(formData);
    const newMessage = content.trim();

    if (newMessage.length) {
      try {
        const { _id: userId, accessToken } = storageUser;
        const { _id: roomId } = storageRoom;
        input.current.value = "";
        input.current.focus();
        setPendingMessages((previousMessages) => [newMessage, ...previousMessages]);
        await axios.post(
          messagesRoute.create,
          {
            userId,
            roomId,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        socket.emit("send-message", { roomId });
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const handleLeaveRoom = async (isChangeRoute = false) => {
    const { accessToken, _id: userId } = storageUser;
    const { _id: roomId } = storageRoom;
    try {
      if (joinedUsers.length === 1) {
        await axios.delete(roomsRoute.deleteById, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { roomId },
        });
      } else {
        await axios.post(
          roomsRoute.leave,
          {
            userId,
            roomId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      if (isChangeRoute) socket.emit("leave-room");
    } catch (error) {
      console.log(error.response.data);
    }
    if (isChangeRoute) {
      localStorage.removeItem("yamess-room");
      navigate("/yamess");
    }
  };

  const handleInviteUser = async (userId, isInvited) => {
    const { accessToken } = storageUser;
    const { _id: roomId } = storageRoom;
    try {
      if (isInvited) {
        await axios.post(
          roomsRoute.removeInvitedUser,
          {
            userId,
            roomId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        socket.emit("invite-user");
      } else {
        await axios.post(
          roomsRoute.addInvitedUser,
          {
            userId,
            roomId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        socket.emit("invite-user");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex w-96 flex-col items-center bg-white p-8 shadow-lg">
        <div className="flex items-center">
          <div className="flex items-center text-3xl text-blue-500">
            <ion-icon name="rocket"></ion-icon>
          </div>
          <div className="text-3xl font-bold text-slate-600">
            Ya
            <span className="text-slate-400">mess</span>
          </div>
        </div>
        <div className="mt-8 rounded-full bg-blue-100 px-8 py-4 font-bold text-blue-400">
          Online: {onlineUsers.length}
        </div>
        <div className="h-full w-full overflow-scroll">
          <div>
            {joinedUsers.map((joinedUser) => (
              <User key={joinedUser.name} data={joinedUser} isJoined={true} />
            ))}
          </div>
          <div className="my-8 h-2 rounded-full bg-blue-200"></div>
          <div>
            {idleUsers.length
              ? idleUsers.map((idleUser) => (
                  <User
                    key={idleUser.name}
                    data={idleUser}
                    isJoined={false}
                    isInvited={invitedUsers.includes(idleUser._id)}
                    toggleInvite={handleInviteUser}
                  />
                ))
              : ""}
          </div>
        </div>
      </div>
      <div className="flex h-screen w-full flex-col p-8">
        <div className="flex justify-between rounded-full bg-white px-8 py-4 text-slate-500">
          <div className="flex items-center">
            <div className="text-2xl font-bold">{name}</div>
            <div className={pendingUsers.length || invitedRooms.length ? "new group relative" : "group relative"}>
              <div className="ml-2 flex cursor-pointer items-center text-3xl group-hover:text-blue-500">
                <ion-icon name="notifications"></ion-icon>
              </div>
              <div className="absolute top-0 left-full hidden w-[30rem]  grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-lg group-hover:grid">
                {pendingUsers.length
                  ? pendingUsers.map((pendingMember) => (
                      <PendingUser key={pendingMember.name} data={pendingMember} socket={socket} />
                    ))
                  : ""}
                {invitedRooms.length
                  ? invitedRooms.map((pendingRoom) => (
                      <PendingRoom key={pendingRoom.name} data={pendingRoom} socket={socket} leave={handleLeaveRoom} />
                    ))
                  : ""}
                {pendingUsers.length + invitedRooms.length ? (
                  ""
                ) : (
                  <div className="text-center italic">No pending requests</div>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={() => handleLeaveRoom(true)}
            className="flex cursor-pointer items-center text-3xl text-slate-400 hover:text-blue-500"
          >
            <ion-icon name={joinedUsers.length === 1 ? "trash" : "log-out"}></ion-icon>
          </div>
        </div>
        <div className="my-4 flex flex-grow flex-col-reverse overflow-auto">
          {pendingMessages.map((message, index) => (
            <PendingMessage key={index + message} data={message} />
          ))}
          {messages.map((message, index) => (
            <Message key={index + message} data={message} />
          ))}
        </div>
        <form onSubmit={handleSendMessage} action="" className="flex w-full">
          <input
            ref={input}
            className="flex-grow rounded-tl-full rounded-bl-full px-8 py-4 text-slate-500 focus:outline-none"
            name="content"
            type="text"
            placeholder="Enter your message"
            autoComplete="off"
          />
          <button
            className="rounded-tr-full rounded-br-full bg-blue-400 px-8 py-4 font-bold text-white hover:bg-blue-500"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
