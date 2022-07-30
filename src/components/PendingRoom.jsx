import { useMemo } from "react";

import axios from "axios";

import { roomsRoute } from "../utils/APIs";

const PendingRoom = ({ data, socket, leave }) => {
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);

  const handlePendingRoom = async (isAccept) => {
    const { accessToken, _id: userId } = storageUser;
    try {
      await axios.post(
        roomsRoute.removeInvitedUser,
        {
          userId,
          roomId: data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!isAccept) return socket.emit("decline-request");
      if (leave) await leave();
      const response = await axios.post(
        roomsRoute.join,
        {
          userId,
          roomId: data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      localStorage.setItem("yamess-room", JSON.stringify(response.data));
      socket.emit("join-room", { userId, roomId: data._id });
      socket.emit("accept-request", { userId, roomId: data._id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full items-center justify-between rounded-lg px-4 py-2 hover:bg-blue-50">
      <div className="mr-4 italic">
        Someone invited you to join room <span className="font-bold capitalize text-blue-400">{data.name}</span>
      </div>
      <div className="flex items-center">
        <div
          onClick={() => handlePendingRoom(true)}
          className="mr-2 flex cursor-pointer items-center text-3xl text-green-300 hover:text-green-400"
        >
          <ion-icon name="checkmark-circle"></ion-icon>
        </div>
        <div
          onClick={() => handlePendingRoom(false)}
          className="flex cursor-pointer items-center text-3xl text-red-300 hover:text-red-400"
        >
          <ion-icon name="close-circle"></ion-icon>
        </div>
      </div>
    </div>
  );
};

export default PendingRoom;
