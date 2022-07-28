const User = ({ data, isJoined }) => {
  return (
    <div className="mt-4 flex w-full items-center justify-center rounded-full bg-blue-400 py-4 text-center text-2xl font-bold capitalize text-white hover:bg-blue-500">
      <div className="mr-4">{data.name}</div>
      {isJoined ? (
        <div className="cursor-pointer rounded-full bg-red-100 px-4 py-2 text-sm text-red-400">Joined</div>
      ) : (
        <div className="cursor-pointer rounded-full bg-green-100 px-4 py-2 text-sm text-green-400">Invite</div>
      )}
    </div>
  )
}

export default User
