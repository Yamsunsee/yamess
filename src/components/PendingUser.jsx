import { useMemo } from "react";

import axios from "axios";

import { roomsRoute } from "../utils/APIs";

const PendingUser = ({ data, socket }) => {
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const storageRoom = useMemo(() => {
    const room = localStorage.getItem("yamess-room");
    if (room) return JSON.parse(room);
  }, []);

  const handlePendingUser = async (isAccept) => {
    try {
      const { accessToken } = storageUser;
      const { _id: roomId } = storageRoom;
      await axios.post(
        roomsRoute.removePendingUser,
        {
          userId: data._id,
          roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!isAccept) return socket.emit("decline-request");
      const response = await axios.post(
        roomsRoute.join,
        {
          userId: data._id,
          roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      localStorage.setItem("yamess-room", JSON.stringify(response.data));
      socket.emit("join-room", { userId: data._id, roomId });
      socket.emit("accept-request", { userId: data._id, roomId });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="flex w-full items-center justify-between rounded-lg px-4 py-2 hover:bg-blue-50">
      <div className="mr-4 italic">
        <span className="font-bold capitalize text-blue-400">{data.name} </span>
        asked to join your room
      </div>
      <div className="flex items-center">
        <div
          onClick={() => handlePendingUser(true)}
          className="mr-2 flex cursor-pointer items-center text-3xl text-green-300 hover:text-green-400"
        >
          <ion-icon name="checkmark-circle"></ion-icon>
        </div>
        <div
          onClick={() => handlePendingUser(false)}
          className="flex cursor-pointer items-center text-3xl text-red-300 hover:text-red-400"
        >
          <ion-icon name="close-circle"></ion-icon>
        </div>
      </div>
    </div>
  );
};

export default PendingUser;
