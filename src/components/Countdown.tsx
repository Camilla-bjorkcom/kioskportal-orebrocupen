import { useEffect, useState } from "react";

function Countdown({ startDate }: { startDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const targetDate = new Date(startDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("Turneringen har börjat!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days} dagar ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="p-5 rounded shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">
        Turneringsstart ⏳
      </h3>
      <p
        className="text-orange-600 text-lg"
        style={{ width: "300px", whiteSpace: "nowrap" }}
      >
        {timeLeft}
      </p>
    </div>
  );
}

export default Countdown;
