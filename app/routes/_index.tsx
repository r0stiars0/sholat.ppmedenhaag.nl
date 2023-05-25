import { json, V2_MetaFunction } from "@remix-run/node";
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from "react";


import { useLoaderData } from "@remix-run/react";
import { DATA_NOT_FOUND, JADWAL_SHOLAT } from "~/model/jadwal.server";
import { DigitalClock } from "~/clock";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Jadwal Sholat Den Haag" }];
};

const schedules = [
  {
    name: 'Fajr',
    description:
      'Subuh'
  },

  {
    name: 'Duhr',
    description:
      'Dzuhur',
    icon: ArrowPathIcon,
  },
  {
    name: 'Asr',
    description:
      'Ashar'
  },
  {
    name: 'Maghrib',
    description:
      'Maghrib'
  },
  {
    name: 'Isha',
    description:
      'Isya'
  },    
]

export async function loader() {
  const currentDate=new Date();
  const yearMonth = currentDate.toLocaleDateString('nl-NL',{year:"numeric"})+'-'+currentDate.toLocaleDateString('nl-NL',{month:"2-digit"});
  const a = JADWAL_SHOLAT.find( month => month.bulan === yearMonth)?.jadwal.find( d => d.Day === currentDate.getDate()) ?? DATA_NOT_FOUND;

  return json(a);
}


function convertStringToDate(time:string)
{
  let d = new Date();
  d.setHours(parseInt(time.substring(0,2)));
  d.setMinutes(parseInt(time.substring(3,5)),0,0);
  return d;
}
export default function Index() {
  const data = useLoaderData<typeof loader>();



  const dataInDateTime = {Day: data.Day, Fajr:convertStringToDate(data.Fajr),Shuruk:convertStringToDate(data.Shuruk),Duhr:convertStringToDate(data.Duhr),
  Asr:convertStringToDate(data.Asr),Maghrib:convertStringToDate(data.Maghrib),Isha:convertStringToDate(data.Isha) }
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };



  return (
    <div className="flex flex-col  justify-between">

      <header className="h-10 text-center"><h2 className="text-base font-semibold leading-7 text-gray-600">Waktu Sholat <span className="text-xl text-indigo-900"></span> untuk Den Haag</h2></header>
      
      <main className=" mb-auto mx-auto max-w-7xl px-6 lg:px-8 pb-2">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-base font-semibold text-indigo-600">{date.toLocaleDateString('id-ID',options) }</h1>
          

            <DigitalClock/>

          <p className="mt-6 text-sm md:text-lg text-gray-600">
          "Sungguh, shalat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman" - Al-Baqarah:43


          </p>
        </div>
        <div className="mx-auto mt-6 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-2 gap-y-2 lg:max-w-none  lg:gap-y-4">
            {
              data.Day === -1 &&
              <h1 className="text-base font-semibold text-gray-600 text-center">Maaf, jadwal sholat tidak tersedia.</h1>
            }
          {data.Day != -1 && schedules.map((s) => (
            <div key={s.name} className="relative border text-center">

              <dt className="text-base font-semibold text-gray-900">
              {s.description}
              </dt>
              <dd className="mb-2 text-xl  text-indigo-600 font-bold">{data[s.name]}</dd>
            </div>
            ))}
          </dl>

        </div>
      </main>
      <footer className="fixed bottom-0 left-0 z-50 w-full h-12 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 bg-gray-50 text-center ">
        <a href="https://ppmedenhaag.nl">PPME Den Haag</a></footer>
    </div>);
}
