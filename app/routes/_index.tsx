import { json, V2_MetaFunction } from "@remix-run/node";
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from "react";


import { useLoaderData } from "@remix-run/react";
import { JADWAL_SHOLAT } from "~/model/jadwal.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Jadwal Sholat Den Haag" }];
};

const schedules = [
  {
    name: 'Fajr',
    description:
      'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Shuruk',
    description:
      'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
    icon: LockClosedIcon,
  },
  {
    name: 'Duhr',
    description:
      'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Asr',
    description:
      'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Maghrib',
    description:
      'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Isha',
    description:
      'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
    icon: FingerPrintIcon,
  },    
]

export async function loader() {
  const currentDate=new Date();
  const yearMonth = currentDate.toLocaleDateString('nl-NL',{year:"numeric"})+'-'+currentDate.toLocaleDateString('nl-NL',{month:"2-digit"});
  const a = JADWAL_SHOLAT.find( month => month.bulan === yearMonth)?.jadwal.find( d => d.Day === currentDate.getDate());
  return json(a);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [date, setDate] = useState(new Date());
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 200);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="h-10 text-center"><h2 className="text-base font-semibold leading-7 text-gray-600">Waktu Sholat <span className="text-xl text-indigo-900"></span> untuk Den Haag</h2></header>
      <main className=" mb-auto mx-auto max-w-7xl px-6 lg:px-8 pb-2">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-base font-semibold text-indigo-600">{date.toLocaleDateString('id-ID',options) }</h1>
          
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <h1>{date.toLocaleTimeString('en-US',{hour12:false})}</h1>
          </p>
          <p className="mt-6 text-sm md:text-lg text-gray-600">
          "Sungguh, shalat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman" - Al-Baqarah:43


          </p>
        </div>
        <div className="mx-auto mt-6 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-2 gap-y-2 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {schedules.map((s) => (
            <div key={s.name} className="relative border text-center">

              <dt className="text-base font-semibold text-gray-900">
              {s.name}
              </dt>
              <dd className="mt-1 text-xl  text-indigo-600 font-bold">{data[s.name]}</dd>
            </div>
            ))}
          </dl>

        </div>
      </main>
      <footer className="h-10 bg-gray-200 text-center "><a href="https://ppmedenhaag.nl">PPME Den Haag</a></footer>
    </div>);
}
