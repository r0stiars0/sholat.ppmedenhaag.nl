import { json, V2_MetaFunction } from "@remix-run/node";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { DATA_NOT_FOUND, JADWAL_SHOLAT } from "~/model/jadwal.server";
import clsx from "clsx";


export const meta: V2_MetaFunction = () => {
  return [{ title: "Jadwal Sholat Den Haag" }];
};

enum SholatPeriods {
  Fajr = "Fadjr",
  Shuruk = "Shoroeq",
  Duhr = "Dhohr",
  Asr = "Asr",
  Maghrib = "Maghrib",
  Isha = "Isha",
}
const schedules = [
  {
    name: "Fajr",
    description: "Fadjr",
  },

  {
    name: "Duhr",
    description: "Dhohr",

  },
  {
    name: "Asr",
    description: "Asr",
  },
  {
    name: "Maghrib",
    description: "Maghrib",
  },
  {
    name: "Isha",
    description: "Isha",
  },
];

function convertStringToDate(time: string) {
  if (time) {
    let d = new Date();
    d.setHours(parseInt(time.substring(0, 2)));
    d.setMinutes(parseInt(time.substring(3, 5)), 0, 0);
    return d;
  }
  return new Date();
}

const dateFormat = new Intl.DateTimeFormat("nl-NL", {
  year: "numeric",
  month: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});
const durationFormat = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const timeFormat = new Intl.DateTimeFormat("nl-NL", {
        
  hour: "2-digit",
  minute:"2-digit",
  second:"2-digit",
  hourCycle: "h23",
  timeZoneName:"short"
});
function dateToString(date: Date) {
  const day =
    date.toLocaleDateString("nl-NL", { year: "numeric" }) +
    "-" +
    date.toLocaleDateString("nl-NL", { month: "2-digit" }) +
    "-" +
    date.toLocaleDateString("nl-NL", { day: "numeric" });
  const time = date.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  return { day: day, time: time };
}
export async function loader() {
  const currentDate = new Date();
  const yearMonth =
    currentDate.toLocaleDateString("nl-NL", { year: "numeric", timeZone: "Europe/Amsterdam" }) +
    "-" +
    currentDate.toLocaleDateString("nl-NL", { month: "2-digit", timeZone: "Europe/Amsterdam" });
  const a =
    JADWAL_SHOLAT.find((month) => month.bulan === yearMonth)?.jadwal.find(
      (d) => d.Day === currentDate.getDate()
    ) ?? DATA_NOT_FOUND;
  const data = mergeTimes(a);

  return json({ data: data, period: compareSchedules(currentDate, data) },{ headers: { 'cache-control': 'no-cache' } });
}

function mergeTimes(d: { Day: number, Fajr: string; Shuruk: string; Duhr: string; Asr: string; Maghrib: string; Isha: string; }) {
  return {
    ...d,
    ...{
      FajrAsDate: convertStringToDate(d.Fajr),
      ShurukAsDate: convertStringToDate(d.Shuruk),
      DuhrAsDate: convertStringToDate(d.Duhr),
      AsrAsDate: convertStringToDate(d.Asr),
      MaghribAsDate: convertStringToDate(d.Maghrib),
      IshaAsDate: convertStringToDate(d.Isha),
    }
  }
}
function minutesUnder1Hour(durationInMS:number)
{
  return durationInMS>60000 && durationInMS<3600000 ? Math.floor(durationInMS/60/1000) : undefined;
}
function compareSchedules(d: Date, data: { FajrAsDate: Date; ShurukAsDate: Date; DuhrAsDate: Date; AsrAsDate: Date; MaghribAsDate: Date; IshaAsDate: Date; }) {
  let durationTimeInMS:number = 0;
  switch (true) {
    case d >= data.FajrAsDate && d < data.ShurukAsDate:

    durationTimeInMS=data.ShurukAsDate.getTime()-d.getTime();
      return {period:SholatPeriods.Fajr, start:data.FajrAsDate,end:data.ShurukAsDate,next:SholatPeriods.Shuruk,remaining:minutesUnder1Hour(durationTimeInMS)};
    case d >= data.DuhrAsDate && d < data.AsrAsDate:
      durationTimeInMS=data.AsrAsDate.getTime()-d.getTime();
      return {period:SholatPeriods.Duhr, start:data.DuhrAsDate,end:data.AsrAsDate, next:SholatPeriods.Asr,remaining:minutesUnder1Hour(durationTimeInMS)};      
    case d >= data.AsrAsDate && d < data.MaghribAsDate:
      durationTimeInMS =data.MaghribAsDate.getTime()-d.getTime();
      return {period:SholatPeriods.Asr,start:data.AsrAsDate,end:data.MaghribAsDate,next:SholatPeriods.Maghrib,remaining:minutesUnder1Hour(durationTimeInMS)};
    case d >= data.MaghribAsDate && d < data.IshaAsDate:
      durationTimeInMS = data.IshaAsDate.getTime()-d.getTime();
      return {period:SholatPeriods.Maghrib,start:data.MaghribAsDate,end:data.IshaAsDate, next:SholatPeriods.Isha, remaining:minutesUnder1Hour(durationTimeInMS)};
    case d >= data.IshaAsDate:
      return {period:SholatPeriods.Isha,start:data.IshaAsDate};
  }
  return {period:""};
}

export default function IframePage() {
  const location = useLocation();

  const [lang,setLang] = useState("nl");
  useEffect(() => {
    let substr =location.pathname.substring(1,3);
    if(substr ==="en" || substr === "id" || substr === "nl")
    setLang( substr);
  }, [location]);
  const o = useLoaderData<typeof loader>();
  const f = useFetcher();
  const [data, setData] = useState(o.data);

  const [date, setDate] = useState(new Date());

  const [period, setPeriod] = useState({period:"",start:null,end:null,next:null});

  const [message,setMessage] = useState("");
  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    if (f.state === "idle" && !f.data) {
      const datetime = dateToString(new Date());

      f.load(`/d/${datetime.day}`);
    }
  }, [f]);

  useEffect(() => {
    const timerID = setInterval(() => {
      const datetime = dateToString(new Date());
      if (f.state === "idle" && datetime.time === "00:00:00") {
        f.load(`/d/${datetime.day}`);
      }
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, [f]);

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    if (f.state === "idle" && !f.data) {
      const datetime = dateToString(new Date());

      f.load(`/d/${datetime.day}`);
    }
    const timerID = setInterval(() => {
      const d = new Date();
      const datetime = dateToString(d);
      if (f.state === "idle" && datetime.time === "00:00:00") {
        f.load(`/d/${datetime.day}`);
      }
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    if (f.data) {
      setData(mergeTimes(f.data));
    }
  }, [f]);

  useEffect(() => {
    const timerID = setInterval(() => {
      const d=new Date();
      setDate(d)

      setPeriod(compareSchedules(d, data));
    }, 200);

    return () => {
      clearInterval(timerID);
    };
  }, [data]);


  // const data = useLoaderData<typeof loader>();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "Europe/Amsterdam",
  };

  const stringMessage = {"id": "Jadwal Sholat Area Den Haag", "en":"Prayer Times for The Hague Area", "nl": "Gebedstijden voor de regio Den Haag"}
  
  return (

        <div className={clsx(data ? "mx-auto mt-2  lg:mt-2 lg:max-w-4xl px-1 " : "hidden")}>

          <div className="text-center border-x border-t rounded-tl-md rounded-tr-md grid grid-cols-1 p-1 bg-zinc-50">
            <div className="text-base text-indigo-700 font-semibold">{stringMessage[lang]}</div>
            <h1 className="text-base italic font-semibold text-zinc-800 ">
            {date.toLocaleDateString(lang||"-NL", options)}
          </h1>          
          </div>
          <dl className="grid grid-cols-5">


            {data &&
              data.Day != -1 &&
              schedules.map((s, idx) => (
                <div
                  key={s.name}
                  className={clsx(
                    "relative text-center text-zinc-700 border-y pt-1 border-l", idx===0 && "rounded-bl-md", idx===4 && "rounded-br-md border-r",
                    period.period === s.description ? "bg-indigo-800 text-white" : ""
                  )}
                >
                  <dt
                    className={clsx(
                      " text-sm font-semibold",
                      period.period === s.description
                        ? "text-white font-bold"
                        : "text-gray-500 font-semibold"
                    )}
                  >
                    {s.description}
                  </dt>
                  <dd
                    className={clsx(
                      "mb-1 text-base",
                      period.period === s.description
                        ? "text-white font-bold "
                        : "text-indigo-600   font-semibold"
                    )}
                  >
                    {data[s.name]}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
  );
}