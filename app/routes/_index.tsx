import { json, V2_MetaFunction } from "@remix-run/node";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { useFetcher, useLoaderData } from "@remix-run/react";
import { DATA_NOT_FOUND, JADWAL_SHOLAT } from "~/model/jadwal.server";
import clsx from "clsx";


export const meta: V2_MetaFunction = () => {
  return [{ title: "Jadwal Sholat Den Haag" }];
};

enum SholatPeriods {
  Fajr = "Subuh",
  Shuruk = "Shuruk",
  Duhr = "Dzuhur",
  Asr = "Ashar",
  Maghrib = "Maghrib",
  Isha = "Isya",
}
const schedules = [
  {
    name: "Fajr",
    description: "Subuh",
  },

  {
    name: "Duhr",
    description: "Dzuhur",
    icon: ArrowPathIcon,
  },
  {
    name: "Asr",
    description: "Ashar",
  },
  {
    name: "Maghrib",
    description: "Maghrib",
  },
  {
    name: "Isha",
    description: "Isya",
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

export default function Index() {
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


  return (
    <div className="flex flex-col  justify-between mx-auto text-center">
      <header className="flex pt-4 pb-2 items-center mx-auto justify-between gap-x-4 lg:gap-x-4 max-w-2xl lg:max-w-4xl border-b">
        
        <img src="ppmedenhaag.png" className="h-8 w-auto flex-none justify-start" alt="PPME Den Haag"/>

        <h2 className="grow text-base font-semibold leading-7 text-gray-600 justify-end">
          Jadwal Sholat Area Den Haag
        </h2>
      </header>

      <main className=" mb-auto mx-auto max-w-xl px-6 lg:px-8 pt-2 pb-20">

        <div className="mx-auto text-center">
          <h1 className="text-base font-semibold text-indigo-700">
            {date.toLocaleDateString("id-NL", options)}
          </h1>

          <div className="text-gray-700  font-bold text-2xl bg-gray-50  rounded-md px-2 py-1">
      <span>{date && date.toLocaleTimeString('nl-NL',{
        
        hour: "2-digit",
        minute:"2-digit",
        second:"2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Amsterdam"
      })}</span>
    </div>
        </div>
        <div className="mx-auto mt-6 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid grid-cols-1 gap-x-2 gap-y-2 lg:max-w-none  lg:gap-y-4">
            {data && data.Day === -1 && (
              <h1 className="text-base font-semibold text-gray-600 text-center">
                Maaf, jadwal sholat tidak tersedia.
              </h1>
            )}

            {data &&
              data.Day != -1 &&
              schedules.map((s) => (
                <div
                  key={s.name}
                  className={clsx(
                    "relative rounded-md text-center border",
                    period.period === s.description ? "bg-indigo-800  " : ""
                  )}
                >
                  <dt
                    className={clsx(
                      " text-base font-semibold",
                      period.period === s.description
                        ? "text-indigo-100  font-bold"
                        : "text-gray-500  font-semibold"
                    )}
                  >
                    {s.description}
                  </dt>
                  <dd
                    className={clsx(
                      "mb-1 text-xl",
                      period.period === s.description
                        ? "text-indigo-50   font-bold "
                        : "text-indigo-600    font-semibold"
                    )}
                  >
                    {data[s.name]}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
        <div className="mt-2 text-sm w-full h-8 md:h-12 text-center">{period && period.remaining && <><span className="font-mono inline-flex items-center rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
        {period.remaining}
      </span> menit sebelum {period.next}</>} </div>
        <p className="mt-6 text-sm md:text-lg text-gray-600  text-center ">
          "Sungguh, sholat itu adalah kewajiban yang ditentukan waktunya atas
          orang-orang yang beriman" - An-Nisa:103
        </p>
      </main>
      <footer className="fixed bottom-0 left-0 z-50 w-full h-12 border-t border-gray-200  bg-gray-50 text-center ">
        <a
          className="font-bold text-indigo-800"
          href="https://ppmedenhaag.nl"
        >
          PPME Den Haag
        </a>
        <p className="text-sm text-gray-600 font-semibold">IBAN NL26 INGB 0002 1661 44</p>
      </footer>
    </div>
  );
}