import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";

import toastConfig from "../utils/toastConfig.js";
import { roomsRoute, messagesRoute } from "../utils/APIs.js";

import Message from "../components/Message.jsx";
import User from "../components/User.jsx";
import PendingUser from "../components/PendingUser.jsx";

const ChatRoom = () => {
  const navigate = useNavigate();

  const socket = useMemo(() => io("http://localhost:5000", { transports: ["websocket"] }), []);
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const storageRoom = useMemo(() => {
    const user = localStorage.getItem("yamess-room");
    if (user) return JSON.parse(user);
  }, []);

  const [name, setName] = useState("Untitle");
  const [type, setType] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [isJoinOrLeaveRoom, setIsJoinOrLeaveRoom] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  const [isNewMessage, setIsNewMessage] = useState(true);
  const input = useRef();

  useEffect(() => {
    if (storageRoom) socket.emit("join-room", { roomId: storageRoom._id });
  }, []);

  useEffect(() => {
    if (storageRoom) {
      setName(storageRoom.name);
      setType(storageRoom.type);
    } else navigate("/");
  }, []);

  useEffect(() => {
    if (storageRoom) {
      fetchMessages(storageUser.accessToken, storageRoom._id);
    }
  }, []);

  useEffect(() => {
    if (isNewMessage) fetchMessages(storageUser.accessToken, storageRoom._id);
  }, [isNewMessage]);

  // useEffect(() => {
  //   if (isNewUser) getOnlineUsers(storageUser.accessToken, onlineUserIds);
  // }, [isNewUser, onlineUserIds]);

  useEffect(() => {
    if (isJoinOrLeaveRoom) fetchRoom(storageUser.accessToken, storageRoom._id);
  }, [isJoinOrLeaveRoom]);

  useEffect(() => {
    socket.on("messages", () => {
      setIsNewMessage(true);
    });
  }, [socket]);

  // useEffect(() => {
  //   rooms.on("room", (users) => {
  //     setIsNewUser(true);
  //     setOnlineUserIds(users);
  //     setIsJoinOrLeaveRoom(true);
  //   });
  // }, [rooms]);

  const fetchRoom = async (accessToken, roomId) => {
    try {
      const { data } = await axios.get(roomsRoute.getById, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      });
      setJoinedUsers(data.members);
      setPendingMembers(data.pendingMembers);
      setIsJoinOrLeaveRoom(false);
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
    }
  };

  const fetchMessages = async (accessToken, roomId) => {
    try {
      const { data } = await axios.get(messagesRoute.getByRoomId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      });
      setMessages(data.reverse());
      setIsNewMessage(false);
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
    }
  };

  // const getOnlineUsers = async (accessToken, userIds) => {
  //   try {
  //     const { data } = await axios.get(APIs.getMany, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       params: { userIds },
  //     });
  //     setOnlineUsers(data);
  //   } catch (error) {
  //     toast.error(error.response.data.message, toastConfig);
  //   }
  // };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { content } = Object.fromEntries(formData);

    if (content.trim().length) {
      try {
        const { _id: userId, accessToken } = storageUser;
        const { _id: roomId } = storageRoom;
        await axios.post(
          messagesRoute.create,
          {
            userId,
            roomId,
            content: content.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        socket.emit("send-message", { roomId });
        input.current.value = "";
        input.current.focus();
      } catch (error) {
        toast.error(error.response.data.message, toastConfig);
      }
    }
  };

  const handleLeaveRoom = async () => {
    const { accessToken, _id: userId } = storageUser;
    const { _id: roomId, host } = storageRoom;
    if (host === userId) return toast.error("You have to change the host of this room before you leave!", toastConfig);
    try {
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
      localStorage.removeItem("yamess-room");
      socket.emit("leave-room");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
    }
  };

  const handleDeleteRoom = async () => {
    const { accessToken } = storageUser;
    const { _id: roomId } = storageRoom;
    try {
      await axios.delete(roomsRoute.deleteById, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { roomId },
      });
      socket.emit("leave-room");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
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
        {/* <div className="mt-8 rounded-full bg-blue-100 px-8 py-4 font-bold text-blue-400">
          Online: {onlineUsers.length}
        </div>
        <div className="h-full w-full overflow-scroll">
          <div>
            {joinedUsers.map((joinedUser, index) => (
              <User key={index} data={joinedUser} isJoined={true} />
            ))}
          </div>
          <div className="my-8 h-2 rounded-full bg-blue-200"></div>
          <div>
            {onlineUsers
              .filter((onlineUser) => joinedUsers.every((joinedUser) => joinedUser.name !== onlineUser.name))
              .map((onlineUser, index) => (
                <User key={index} data={onlineUser} isJoined={false} />
              ))}
          </div>
        </div> */}
      </div>
      <div className="flex h-screen w-full flex-col p-8">
        <div className="flex justify-between rounded-full bg-white px-8 py-4 text-slate-500">
          <div className="flex items-center">
            <div className="text-2xl font-bold">{name}</div>
            {type ? (
              <div className={pendingMembers.length ? "new group relative" : "group relative"}>
                <div className="ml-2 flex cursor-pointer items-center text-3xl group-hover:text-blue-500">
                  <ion-icon name="notifications"></ion-icon>
                </div>
                <div className="absolute top-full left-1/2 hidden w-[30rem] -translate-x-1/2 transform grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-lg group-hover:grid">
                  {pendingMembers.length ? (
                    pendingMembers.map((pendingMember) => <PendingUser key={pendingMember.name} data={pendingMember} />)
                  ) : (
                    <div className="text-center italic">No pending requests</div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {joinedUsers.length === 1 ? (
            <div
              onClick={handleDeleteRoom}
              className="flex cursor-pointer items-center text-3xl text-slate-400 hover:text-blue-500"
            >
              <ion-icon name="trash"></ion-icon>
            </div>
          ) : (
            <div
              onClick={handleLeaveRoom}
              className="flex cursor-pointer items-center text-3xl text-slate-400 hover:text-blue-500"
            >
              <ion-icon name="log-out"></ion-icon>
            </div>
          )}
        </div>
        <div className="my-4 flex flex-grow flex-col-reverse overflow-auto">
          {messages.map((message, index) => (
            <Message key={index} data={message} />
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
