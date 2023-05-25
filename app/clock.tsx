import { useEffect, useState } from "react";

export function DigitalClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 500);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className="text-gray-700 font-bold text-3xl bg-gray-50 rounded-md px-2 py-1">
      <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
    </div>
  );
}
