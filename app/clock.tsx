import { useEffect, useState } from "react";

export function DigitalClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className="text-gray-700 dark:text-gray-200 font-bold text-3xl bg-gray-50 dark:bg-gray-800 rounded-md px-2 py-1">
      <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
    </div>
  );
}
