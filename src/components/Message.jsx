import { useMemo } from "react";

const Message = ({ data }) => {
  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);
  const self = storageUser.name === data.userId.name;

  return (
    <>
      {self ? (
        <div className="mt-4 flex items-center justify-end">
          <div className="w-fit rounded-full rounded-br-none bg-blue-400 px-8 py-2 font-bold text-white">
            {data.content}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-end">
          {/* <div className="mr-2 h-8 w-8 overflow-hidden rounded-full" data-tip="Min" data-place="left">
            <img className="h-full w-full object-cover" src="https://source.unsplash.com/random" alt="image" />
          </div> */}
          <div className="mr-2 font-bold leading-4 text-slate-500">{data.userId.name}</div>
          <div className="w-fit rounded-full rounded-bl-none bg-blue-100 px-8 py-2 font-bold text-blue-400">
            {data.content}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
