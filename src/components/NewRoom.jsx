import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

import { roomsRoute } from "../utils/APIs.js";
import toastConfig from "../utils/toastConfig.js";

const NewRoom = ({ toggle, socket }) => {
  const [type, setType] = useState("public");
  const [limit, setLimit] = useState(2);
  const navigate = useNavigate();
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { roomName, roomType, roomLimit } = Object.fromEntries(formData);

    try {
      const { accessToken, _id: userId } = storageUser;
      const { data } = await axios.post(
        roomsRoute.create,
        {
          name: roomName.length ? roomName : undefined,
          type: roomType,
          limit: roomLimit,
          userId,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      localStorage.setItem("yamess-room", JSON.stringify(data));
      socket.emit("join-room", { userId, roomId: data._id });
      navigate("/chatroom");
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
    }
    toggle(false);
  };

  return (
    <div onClick={() => toggle(false)} className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex h-[32rem] w-96 flex-col items-center justify-center rounded-lg bg-white p-8 transition 2xl:h-[40rem]"
      >
        <div className="text-4xl font-bold text-slate-600">Add new room</div>
        <form id="form" onSubmit={handleSubmit} className="mt-8 flex w-full flex-col items-center">
          <input
            name="roomName"
            className="w-full border-b p-4 font-light text-slate-400 placeholder:text-slate-300 focus:outline-none"
            type="text"
            placeholder="Untitle"
            autoComplete="off"
          />
          <div className="mt-8 flex w-full justify-between text-slate-400">
            <div className="flex flex-col">
              <div>
                <input
                  onChange={() => setType("public")}
                  id="public"
                  name="roomType"
                  value="false"
                  className="mr-1 cursor-pointer"
                  type="radio"
                  checked={type === "public"}
                />
                <label className="cursor-pointer" htmlFor="public">
                  Public
                </label>
              </div>
              <div>
                <input
                  onChange={() => setType("private")}
                  id="private"
                  name="roomType"
                  value="true"
                  className="mr-1 cursor-pointer"
                  type="radio"
                  checked={type === "private"}
                />
                <label className="cursor-pointer" htmlFor="private">
                  Private
                </label>
              </div>
            </div>
            <div className="flex flex-col text-slate-400">
              <div className="mb-2">Members: {limit}</div>
              <input
                type="range"
                name="roomLimit"
                min={2}
                max={10}
                value={limit}
                onChange={(event) => setLimit(event.target.value)}
              />
            </div>
          </div>
        </form>
        <button
          type="submit"
          form="form"
          className="mt-12 flex w-full cursor-pointer justify-center self-center rounded-full bg-blue-500 px-6 py-4 text-2xl font-bold uppercase text-white hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={() => {
            toggle(false);
          }}
          className="mt-4 flex w-full cursor-pointer justify-center self-center rounded-full bg-slate-400 px-6 py-4 text-2xl font-bold uppercase text-white hover:bg-slate-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewRoom;
