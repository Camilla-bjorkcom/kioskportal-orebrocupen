const DaysLeftTourStat = () => {
  return (
    <div className="flex flex-col mb-6 p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video xl:w-128 xl:h-64 place-self-center md:place-self-end mt-10  ">
      <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 font-bold text-sm sm:text-lg xl:text-2xl">
        Återstående tid till turnering
      </p>
      <p className="text-right font-bold lg:m-5 text-sm sm:text-xl xl:text-2xl">
        120 dagar
      </p>
    </div>
  );
};

export default DaysLeftTourStat;
