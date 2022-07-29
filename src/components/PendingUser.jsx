import { useMemo } from "react";

import axios from "axios";
import { toast } from "react-toastify";

import toastConfig from "../utils/toastConfig.js";
import { roomsRoute } from "../utils/APIs";

const PendingUser = ({ data, socket }) => {
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const storageRoom = useMemo(() => {
    const user = localStorage.getItem("yamess-room");
    if (user) return JSON.parse(user);
  }, []);

  const handlePendingUser = async () => {
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
      socket.emit("handle-request");
    } catch (error) {
      console.log(error);
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
          onClick={handlePendingUser}
          className="mr-2 flex cursor-pointer items-center text-3xl text-green-300 hover:text-green-400"
        >
          <ion-icon name="checkmark-circle"></ion-icon>
        </div>
        <div
          onClick={handlePendingUser}
          className="flex cursor-pointer items-center text-3xl text-red-300 hover:text-red-400"
        >
          <ion-icon name="close-circle"></ion-icon>
        </div>
      </div>
    </div>
  );
};

export default PendingUser;
