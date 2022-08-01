const PendingMessage = ({ data }) => {
  return (
    <div className="mt-4 flex items-center justify-end">
      <div className="w-fit rounded-full rounded-br-none bg-blue-300 px-8 py-2 font-bold text-white">{data}</div>
    </div>
  );
};

export default PendingMessage;
