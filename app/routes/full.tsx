import { json, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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
  const nlDayFormat = new Intl.DateTimeFormat('nl-NL', {weekday:"short"});


  

  return (
    <div className="flex flex-col  justify-between mx-auto text-center">
      <div className="flex pt-4 pb-2 items-center mx-auto justify-between gap-x-4 lg:gap-x-4 max-w-2xl lg:max-w-4xl border-b">
        <img
          src="ppmedenhaag.png"
          className="h-8 w-auto flex-none justify-start"
          alt="PPME Den Haag"
        />

        <h2 className="grid grid-cols-1 grow text-sm md:text-base divide-y divide-indigo-700 font-semibold leading-7 text-gray-600 justify-end">
          <span>🇮🇩 Jadwal Sholat Den Haag {year}</span>
          <span>🇳🇱 Gebedstijden Den Haag {year}</span>
        </h2>
      </div>
      <ol className="text-zinc-800  list-decimal mx-auto pt-8 pb-2">
        {schedule &&
          schedule.length > 0 &&
          schedule.map((m) => 
          <li key={m.bulan} className=" px-1 py-0.5  disc text-sm md:text-lg font-semibold text-left"><Link className="px-1  bg-gray-50 text-indigo-700 border-b border-b-indigo-700" to={`/full#${m.bulan}`}>{idFormat.format(new Date(m.bulan+"-01"))} / {nlFormat.format(new Date(m.bulan+"-01"))}</Link></li>
)}</ol>

      <div className="text-zinc-800 mb-auto mx-auto md:max-w-6xl px-2 lg:px-8 pt-2 pb-20">
        {schedule &&
          schedule.length > 0 &&
          schedule.map((m) => 
          <div key={m.bulan} className="pt-8 pb-2">
            <h2 id={m.bulan} className="text-xl font-semibold py-2">{idFormat.format(new Date(m.bulan+"-01"))} / {nlFormat.format(new Date(m.bulan+"-01"))}</h2>
            <table className="table-auto border border-collapse   border-indigo-800 text-xs md:text-base text-zinc-800">
              <thead><tr className="font-thin text-zinc-800 text-xs md:text-base">
              <th className=" border border-indigo-800 px-1">Tanggal / dag</th>
              <th className="border border-indigo-800 px-1">Subuh</th>
              <th className="border border-indigo-800 px-1">Dzuhur</th>
              <th className="border border-indigo-800 px-1">Ashar</th>
              <th className="border border-indigo-800 px-1">Maghrib</th>
              <th className="border border-indigo-800 px-1">Isya</th>
              </tr></thead>
              <tbody>
              {m.jadwal.map(d => 
              <tr key={d.Day} className="text-zinc-700 text-xs md:text-base">
                <td className="border border-indigo-800 px-1">
                  <div className="flex flex-auto items-center divide-x divide-indigo-500">
                  <div className="w-12 text-xs md:text-base font-semibold text-center">{d.Day}</div>
                  <div className="w-full text-xs md:text-sm font-medium grid grid-cols-1 divide-y divide-indigo-500 px-1 text-center">
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
