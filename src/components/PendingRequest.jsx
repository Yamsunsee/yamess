const PendingRequest = ({ toggle }) => {
  return (
    <div onClick={() => toggle(false)} className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex h-[32rem] w-96 flex-col items-center justify-center rounded-lg bg-white p-8 transition 2xl:h-[40rem]"
      >
        <div className="text-center italic text-slate-400">
          Your request has been sent!
          <br />
          Please wait for the host of this room!
        </div>
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

export default PendingRequest;
