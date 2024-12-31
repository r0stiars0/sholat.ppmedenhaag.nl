
import { json, LoaderArgs } from "@remix-run/node";

import { DATA_NOT_FOUND, JADWAL_SHOLAT } from "~/model/jadwal.server";



export async function loader({ params }: LoaderArgs) {

    const date = params.date;
    const yearMonth = date!.substring(5,7);
    const day = parseInt(date!.substring(8));
    const a =
      JADWAL_SHOLAT.find((month) => month.bulan === yearMonth)?.jadwal.find(
        (d) => d.Day === day
      ) ?? DATA_NOT_FOUND;
  
    return json(a, { headers: { 'cache-control': 'no-cache' } });
  }
  