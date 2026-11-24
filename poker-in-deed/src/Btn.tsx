const Btn = ({ func, desc }: { func: Function; desc: string }) => {
  return (
    <>
      <button
        className={`text-black font-normal w-fit border-3 border-[#855f49] rounded-xl bg-[#dfc9bd] px-5 py-2 mx-auto cursor-pointer`}
        onClick={() => {
          func();
        }}
      >
        {desc}
      </button>
    </>
  );
};

export default Btn;
