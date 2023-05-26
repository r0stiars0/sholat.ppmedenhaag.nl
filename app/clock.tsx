import { useEffect, useState } from "react";

export function DigitalClock() {
    const timeFormat = new Intl.DateTimeFormat("nl-NL", {
        
        hour: "2-digit",
        minute:"2-digit",
        second:"2-digit",
        hourCycle: "h23",
        timeZoneName:"short"
      });
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
      <span>{time && time.toLocaleTimeString('nl-NL',{
        
        hour: "2-digit",
        minute:"2-digit",
        second:"2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Amsterdam"
      })}</span>
    </div>
  );
}
