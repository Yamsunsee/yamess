const User = ({ data, isJoined }) => {
  return (
    <div className="mt-4 flex w-full items-center justify-center rounded-full bg-blue-400 py-4 text-center text-2xl font-bold capitalize text-white hover:bg-blue-500">
      <div className="mr-4">{data.name}</div>
      {isJoined ? (
        <div className="rounded-full bg-white px-4 py-2 text-sm text-blue-400 shadow-lg">Joined</div>
      ) : (
        <div className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm text-blue-400 shadow-lg hover:text-green-500">
          Invite
        </div>
      )}
    </div>
  );
};

export default User;
