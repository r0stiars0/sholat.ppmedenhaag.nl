import { json, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { JADWAL_SHOLAT } from "~/model/jadwal.server";

type LoaderData = {
  schedule: typeof JADWAL_SHOLAT;
  year: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return json({
    schedule: JADWAL_SHOLAT,
    year: new Date(Date.now()).getFullYear(),
  });
};

export default function FullSchedule() {
  const { schedule, year } = useLoaderData<LoaderData>();
  const idFormat = new Intl.DateTimeFormat('id-ID', {month:"long"});
  const nlFormat = new Intl.DateTimeFormat('nl-NL', {month:"long"});

  const idDayFormat = new Intl.DateTimeFormat('id-ID', {weekday:"long"});
  const nlDayFormat = new Intl.DateTimeFormat('nl-NL', {weekday:"long"});


  

  return (
    <div className="flex flex-col  justify-between mx-auto text-center">
      <div className="flex pt-4 pb-2 items-center mx-auto justify-between gap-x-4 lg:gap-x-4 max-w-2xl lg:max-w-4xl border-b">
        <img
          src="ppmedenhaag.png"
          className="h-8 w-auto flex-none justify-start"
          alt="PPME Den Haag"
        />

        <h2 className="grow text-base font-semibold leading-7 text-gray-600 dark:text-gray-100  justify-end">
          Jadwal Sholat Area Den Haag {year}
        </h2>
      </div>

      <div className="text-zinc-800 mb-auto mx-auto md:max-w-6xl px-6 lg:px-8 pt-2 pb-20">
        {schedule &&
          schedule.length > 0 &&
          schedule.map((m) => 
          <div key={m.bulan} className="pt-8 pb-2">
            <h2 className="text-xl font-semibold py-2">{idFormat.format(new Date(m.bulan+"-01"))} / {nlFormat.format(new Date(m.bulan+"-01"))}</h2>
            <table className="table-auto border border-collapse   border-indigo-800 text-xs md:text-base">
              <thead><tr className="font-thin">
              <th className=" border border-indigo-800 px-1">Dag</th>
              <th className="border border-indigo-800 px-1">Subuh</th>
              <th className="border border-indigo-800 px-1">Dzuhur</th>
              <th className="border border-indigo-800 px-1">Ashar</th>
              <th className="border border-indigo-800 px-1">Maghrib</th>
              <th className="border border-indigo-800 px-1">Isya</th>
              </tr></thead>
              <tbody>
              {m.jadwal.map(d => 
              <tr key={d.Day} className="">
                <td className="border border-indigo-800 px-1">
                  <div className="flex flex-auto items-center divide-x divide-indigo-500">
                  <div className="w-12 text-xl font-semibold text-center">{d.Day}</div>
                  <div className="w-full grid grid-cols-1 divide-y divide-indigo-500 px-1 text-center">
                    <span>{idDayFormat.format(new Date(m.bulan+"-"+d.Day.toLocaleString(undefined,{minimumIntegerDigits:2})))}</span>
                  <span>{nlDayFormat.format(new Date(m.bulan+"-"+d.Day.toLocaleString(undefined,{minimumIntegerDigits:2})))}</span>
                  </div>
                  </div>
                </td>
                <td className="border border-indigo-800 px-1">{d.Fajr}</td>
                <td className="border border-indigo-800 px-1">{d.Duhr}</td>
                <td className="border border-indigo-800 px-1">{d.Asr}</td>
                <td className="border border-indigo-800 px-1">{d.Maghrib}</td>
                <td className="border border-indigo-800 px-1">{d.Isha}</td>                
              </tr>)}
              </tbody>
            </table>
          </div>)}
      </div>
    </div>
  );
}
