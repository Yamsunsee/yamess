import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";

import { roomsRoute } from "../utils/APIs.js";

import NewRoom from "../components/NewRoom";
import WaitingRoom from "../components/WaitingRoom";
import PendingRequest from "../components/PendingRequest";
import PendingRoom from "../components/PendingRoom.jsx";

const Lobby = () => {
  const navigate = useNavigate();
  const socket = useMemo(() => io("http://localhost:5000", { transports: ["websocket"] }), []);
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const isNewUser = useMemo(() => {
    const user = localStorage.getItem("yamess-new");
    if (user) return false;
    return true;
  }, []);

  const [name, setName] = useState("Buddy");
  const [rooms, setRooms] = useState([]);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [invitedRooms, setInvitedRooms] = useState([]);
  const [type, setType] = useState("all");
  const [layout, setLayout] = useState("3");
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isShowModalRoom, setIsShowModalRoom] = useState(false);
  const [isShowModalRequest, setIsShowModalRequest] = useState(false);
  const [isRoomsChange, setIsRoomsChange] = useState(true);

  useEffect(() => {
    if (storageUser) setName(storageUser.name);
    else if (isNewUser) navigate("/signup");
    else navigate("/signin");
  }, []);

  useEffect(() => {
    const isInRoom = localStorage.getItem("yamess-room");
    if (isInRoom) navigate("/chatroom");
  }, []);

  useEffect(() => {
    if (storageUser) socket.emit("join-lobby", { userId: storageUser._id });
  }, []);

  useEffect(() => {
    if (storageUser && isRoomsChange) fetchRooms();
  }, [isRoomsChange]);

  useEffect(() => {
    const text = search.trim().toLowerCase();
    let newSortedRoom = rooms;
    if (text.length) {
      newSortedRoom = rooms.filter(
        (room) => room.name.toLowerCase().includes(text) || room._id.toLowerCase().includes(text)
      );
    }
    switch (type) {
      case "all":
        setSortedRooms(newSortedRoom);
        break;

      case "public":
        const publicRooms = newSortedRoom.filter((room) => !room.type);
        setSortedRooms(publicRooms);
        break;

      case "private":
        const privateRooms = newSortedRoom.filter((room) => room.type);
        setSortedRooms(privateRooms);
        break;

      default:
        break;
    }
  }, [rooms, type, search]);

  useEffect(() => {
    socket.on("users-change", (users) => {
      setOnlineUsers(users);
    });
    socket.on("rooms-change", (users) => {
      setOnlineUsers(users);
      setIsRoomsChange(true);
    });
    socket.on("accept-request", ({ userId, roomId }) => {
      if (userId === storageUser._id) {
        handleJoinRoom({ type: false, _id: roomId });
      }
    });
    socket.on("decline-request", () => {
      setIsShowModalRequest(false);
    });
  }, [socket]);

  useEffect(() => {
    if (!isShowModalRequest) handleCancleRequest();
  }, [isShowModalRequest]);

  const fetchRooms = async () => {
    const { accessToken, _id: userId } = storageUser;
    try {
      const { data } = await axios.get(roomsRoute.getAll, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
      setRooms(data.reverse());
      setInvitedRooms(invitedRooms.data);
      setIsRoomsChange(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("yamess-user");
    localStorage.removeItem("yamess-room");
    socket.emit("leave-lobby");
    navigate("/signin");
  };

  const handleJoinRoom = async (room) => {
    const { accessToken, _id: userId } = storageUser;
    const { _id: roomId, type } = room;
    try {
      const route = type ? roomsRoute.addPendingUser : roomsRoute.join;
      const { data } = await axios.post(
        route,
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
      localStorage.setItem("yamess-room", JSON.stringify(data));
      if (!type) {
        navigate("/chatroom");
      } else {
        setIsShowModalRequest(true);
      }
      socket.emit("join-room", { userId, roomId: data._id });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleCancleRequest = async () => {
    try {
      const room = localStorage.getItem("yamess-room");
      if (room) {
        const storageRoom = JSON.parse(room);
        const { _id: userId, accessToken } = storageUser;
        const { _id: roomId } = storageRoom;
        await axios.post(
          roomsRoute.removePendingUser,
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
        socket.emit("decline-request");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="w-full self-start">
      {isShowModalRoom ? <NewRoom toggle={setIsShowModalRoom} socket={socket} /> : ""}
      {isShowModalRequest ? <PendingRequest toggle={setIsShowModalRequest} /> : ""}
      <div className="bg-texture sticky top-0 z-10 p-8 shadow-lg">
        <div className="flex items-end justify-between">
          <div className="flex items-center">
            <div className="flex items-center text-3xl text-blue-500">
              <ion-icon name="rocket"></ion-icon>
            </div>
            <div className="text-3xl font-bold text-slate-600">
              Ya
              <span className="text-slate-400">mess</span>
            </div>
            <div
              className={invitedRooms.length ? "new group relative text-slate-500" : "group relative text-slate-500"}
            >
              <div className="ml-2 flex cursor-pointer items-center text-3xl group-hover:text-blue-500">
                <ion-icon name="notifications"></ion-icon>
              </div>
              <div className="absolute top-0 left-full hidden  w-[30rem] grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-lg group-hover:grid">
                {invitedRooms.length ? (
                  invitedRooms.map((pendingRoom) => (
                    <PendingRoom key={pendingRoom.name} data={pendingRoom} socket={socket} />
                  ))
                ) : (
                  <div className="text-center italic">No pending requests</div>
                )}
              </div>
            </div>
          </div>
          <div className="italic text-slate-400">
            Hello <span className="font-bold capitalize text-red-400">{name}</span>!{" "}
            <span className="hidden lg:inline-block">Your friends are online! Let's join to chat with them!</span>
          </div>
          <div
            onClick={handleSignOut}
            className="flex cursor-pointer items-center text-3xl text-slate-400 hover:text-blue-500"
          >
            <ion-icon name="log-out"></ion-icon>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div
            onClick={() => setIsShowModalRoom(true)}
            className="flex w-fit cursor-pointer self-center rounded-full bg-blue-500 px-8 py-4 text-white hover:bg-blue-600"
          >
            <div className="mr-2 flex items-center text-xl">
              <ion-icon name="add-circle"></ion-icon>
            </div>
            <div className="font-bold">New room</div>
          </div>
          <div className="flex">
            <div className="mr-4 rounded-full bg-blue-100 px-8 py-4 font-bold text-blue-400">
              Online: {onlineUsers.length}
            </div>
            <div className="rounded-full bg-blue-100 px-8 py-4 font-bold text-blue-400">Room: {rooms.length}</div>
          </div>
          <input
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-full px-8 py-4 font-bold text-slate-400 focus:outline-slate-400"
            type="text"
            placeholder="Find room by name or ID"
            autoComplete="off"
          />
          <div className="flex font-bold text-slate-400">
            <div className="mr-4 text-2xl leading-4">
              <ion-icon name="funnel"></ion-icon>
            </div>
            <div className="mr-4">
              <input
                onChange={() => setType("all")}
                type="radio"
                name="sort"
                id="all"
                className="cursor-pointer"
                checked={type === "all"}
              />
              <label className="ml-1 cursor-pointer" htmlFor="all">
                All
              </label>
            </div>
            <div className="mr-4">
              <input
                onChange={() => setType("public")}
                type="radio"
                name="sort"
                id="public"
                className="cursor-pointer"
                checked={type === "public"}
              />
              <label className="ml-1 cursor-pointer" htmlFor="public">
                Public
              </label>
            </div>
            <div>
              <input
                onChange={() => setType("private")}
                type="radio"
                name="sort"
                id="private"
                className="cursor-pointer"
                checked={type === "private"}
              />
              <label className="ml-1 cursor-pointer" htmlFor="private">
                Private
              </label>
            </div>
          </div>
          <div className="flex items-center text-slate-400">
            <div className="mr-4 text-2xl leading-4">
              <ion-icon name="grid"></ion-icon>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <input
                  onChange={() => setLayout("3")}
                  type="radio"
                  name="arrange"
                  id="3x"
                  className="cursor-pointer"
                  checked={layout === "3"}
                />
                <label className="ml-1 cursor-pointer" htmlFor="3x">
                  3x
                </label>
              </div>
              <div className="mr-4">
                <input
                  onChange={() => setLayout("2")}
                  type="radio"
                  name="arrange"
                  id="2x"
                  className="cursor-pointer"
                  checked={layout === "2"}
                />
                <label className="ml-1 cursor-pointer" htmlFor="2x">
                  2x
                </label>
              </div>
              <div>
                <input
                  onChange={() => setLayout("1")}
                  type="radio"
                  name="arrange"
                  id="1x"
                  className="cursor-pointer"
                  checked={layout === "1"}
                />
                <label className="ml-1 cursor-pointer" htmlFor="1x">
                  1x
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={layout === "3" ? "grid-3x" : layout === "2" ? "grid-2x" : "grid-1x"}>
        {sortedRooms.map((room) => {
          return <WaitingRoom key={room._id} data={room} join={handleJoinRoom} />;
        })}
      </div>
    </div>
  );
};

export default Lobby;
