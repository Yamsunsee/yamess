import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"
import io from "socket.io-client"
import { toast } from "react-toastify"

import toastConfig from "../utils/toastConfig.js"
import * as APIs from "../utils/APIs.js"

import Message from "./Message.jsx"
import User from "./User.jsx"

const ChatRoom = () => {
  const navigate = useNavigate()

  const rooms = useMemo(() => io("http://localhost:5000/rooms", { transports: ["websocket"] }), [])
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user")
    if (user) return JSON.parse(user)
  }, [])
  const storageRoom = useMemo(() => {
    const user = localStorage.getItem("yamess-room")
    if (user) return JSON.parse(user)
  }, [])

  const [title, setTitle] = useState("Untitle")
  const [messages, setMessages] = useState([])
  const [onlineUserIds, setOnlineUserIds] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [joinedUsers, setJoinedUsers] = useState([])
  const [isJoinOrLeaveRoom, setIsJoinOrLeaveRoom] = useState(true)
  const [isNewUser, setIsNewUser] = useState(true)
  const [isNewMessage, setIsNewMessage] = useState(true)
  const input = useRef()

  useEffect(() => {
    if (storageRoom) rooms.emit("join-room", { roomId: storageRoom._id })
  }, [])

  useEffect(() => {
    if (storageRoom) setTitle(storageRoom.title)
    else navigate("/")
  }, [])

  useEffect(() => {
    if (storageRoom) {
      fecthMessages(storageUser.accessToken, storageRoom._id)
    }
  }, [])

  useEffect(() => {
    if (storageRoom && storageUser && isNewMessage) fecthMessages(storageUser.accessToken, storageRoom._id)
  }, [isNewMessage])

  useEffect(() => {
    if (storageUser && isNewUser) getOnlineUsers(storageUser.accessToken, onlineUserIds)
  }, [isNewUser, onlineUserIds])

  useEffect(() => {
    if (storageUser && isJoinOrLeaveRoom) fetchRoom(storageUser.accessToken, storageRoom._id)
  }, [isJoinOrLeaveRoom])

  useEffect(() => {
    rooms.on("message", () => {
      setIsNewMessage(true)
    })
  }, [rooms])

  useEffect(() => {
    rooms.on("room", (users) => {
      setIsNewUser(true)
      setOnlineUserIds(users)
      setIsJoinOrLeaveRoom(true)
    })
  }, [rooms])

  const fetchRoom = async (accessToken, roomId) => {
    try {
      const { data } = await axios.get(APIs.getRoomById, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      })
      setJoinedUsers(data.users)
      setIsJoinOrLeaveRoom(false)
    } catch (error) {
      toast.error(error.response.data.message, toastConfig)
    }
  }

  const fecthMessages = async (accessToken, roomId) => {
    try {
      const { data } = await axios.get(APIs.getMessages, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          roomId,
        },
      })
      setMessages(data.reverse())
      setIsNewMessage(false)
    } catch (error) {
      toast.error(error.response.data.message, toastConfig)
    }
  }

  const leaveRoom = async (accessToken, userId, roomId) => {
    try {
      await axios.post(
        APIs.leaveRoom,
        {
          userId,
          roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      rooms.emit("leave-room")
    } catch (error) {
      toast.error(error.response.data.message, toastConfig)
    }
  }

  const getOnlineUsers = async (accessToken, userIds) => {
    try {
      const { data } = await axios.get(APIs.getMany, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { userIds },
      })
      setOnlineUsers(data)
    } catch (error) {
      toast.error(error.response.data.message, toastConfig)
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { content } = Object.fromEntries(formData)

    if (content.trim().length) {
      try {
        const { _id: userId, accessToken } = storageUser
        const { _id: roomId } = storageRoom
        await axios.post(
          APIs.createMessage,
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
        )
        rooms.emit("send-message", { roomId })
        input.current.value = ""
        input.current.focus()
      } catch (error) {
        toast.error(error.response.data.message, toastConfig)
      }
    }
  }

  const handleLeaveRoom = () => {
    const { accessToken, _id: userId } = storageUser
    const { _id: roomId } = storageRoom
    leaveRoom(accessToken, userId, roomId)
    localStorage.removeItem("yamess-room")
    navigate("/")
  }

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
        </div>
      </div>
      <div className="flex h-screen w-full flex-col p-8">
        <div className="flex justify-between rounded-full bg-white px-8 py-4 text-2xl font-bold text-slate-500">
          <div>{title}</div>
          <div
            onClick={handleLeaveRoom}
            className="flex cursor-pointer items-center text-3xl text-slate-400 hover:text-blue-500"
          >
            <ion-icon name="log-out"></ion-icon>
          </div>
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
  )
}

export default ChatRoom
