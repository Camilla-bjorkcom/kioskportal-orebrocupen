const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 font-bold text-sm  sm:text-xl xl:text-2xl">
          Anläggningar
        </p>
        <p className="text-right font-bold lg:m-5 lg:text-4xl text-xl">3</p>
      </div>
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 font-bold text-sm sm:text-xl  xl:text-2xl">
          Kiosker
        </p>
        <p className="text-right font-bold lg:m-5  lg:text-4xl text-xl">7</p>
      </div>
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 font-bold text-sm sm:text-xl xl:text-2xl">
          Produktlistor
        </p>
        <p className="text-right font-bold lg:m-5  lg:text-4xl text-xl">1</p>
      </div>
    </div>
  );
};

export default DashboardStats;
