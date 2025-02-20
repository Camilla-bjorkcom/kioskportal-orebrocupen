import { useEffect, useState } from "react";

function Countdown({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now >= endTimestamp) {
        setTimeLeft("Turneringen avslutad");
        clearInterval(interval);
        return;
      }

      if (now >= startTimestamp) {
        setTimeLeft("Turneringen pågår");
        return;
      }

      const difference = startTimestamp - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days} dagar ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <div className="p-5 rounded-lg shadow-md dark:bg-slate-800">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Turneringsstatus
      </h3>
      <p
        className="text-orange-600 text-lg dark:text-orange-400"
        style={{ width: "300px", whiteSpace: "nowrap" }}
      >
        {timeLeft}
      </p>
    </div>
  );
}

export default Countdown;
