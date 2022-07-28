import { toast } from "react-toastify"
import toastConfig from "../utils/toastConfig.js"

const WaitingRoom = ({ data, join }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(data._id)
    toast.info("Copied to clipboard!", toastConfig)
  }

  return (
    <div className="flex flex-col rounded-lg bg-white p-8 shadow-lg">
      <div className="flex items-center">
        <div className="mr-4 h-20 w-20 overflow-hidden rounded-full">
          <img className="h-full w-full object-cover" src="https://source.unsplash.com/random" alt="avatar" />
        </div>
        <div>
          <div className="text-2xl font-bold capitalize text-slate-500">{data.title}</div>
          <div
            onClick={handleCopy}
            title="Click to copy"
            className="flex cursor-pointer items-center text-sm italic text-slate-400"
          >
            <div className="flex items-center justify-center text-xl">
              <ion-icon name="key"></ion-icon>
            </div>
            <div>{data._id}</div>
          </div>
          <div className="mt-2 flex items-center">
            {data.isPrivate ? (
              <div className="w-fit rounded-full bg-orange-100 px-4 py-2 text-orange-400">Personal</div>
            ) : (
              <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-green-400 ">Everyone</div>
            )}
            <div
              className={
                "ml-4 flex w-fit items-center justify-center rounded-full px-4 py-2 " +
                (data.isPrivate ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-400")
              }
            >
              <div className="mr-2 text-lg leading-4">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <div>{data.users.length}</div>
            </div>
          </div>
        </div>
      </div>
      {data.isPrivate === true ? (
        <div
          onClick={() => join(data)}
          className="mt-8 w-full cursor-pointer rounded-lg bg-orange-400 px-8 py-4 text-center text-xl font-bold uppercase text-white hover:bg-orange-500"
        >
          Ask to join room
        </div>
      ) : (
        <div
          onClick={() => join(data)}
          className="mt-8 w-full cursor-pointer rounded-lg bg-green-400 px-8 py-4 text-center text-xl font-bold uppercase text-white hover:bg-green-500"
        >
          Join room
        </div>
      )}
    </div>
  )
}

export default WaitingRoom
