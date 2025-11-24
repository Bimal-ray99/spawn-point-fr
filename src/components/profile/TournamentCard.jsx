"use client";

import { Users } from "lucide-react";

export function TournamentCard() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      <div className="absolute inset-0 bg-[url('/images/apex.jpg')] bg-cover bg-center opacity-50" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex justify-between">
          <span className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Live Now
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 backdrop-blur-md">
            <Users className="h-3 w-3 text-gray-300" />
            <span className="text-xs font-bold">128/200</span>
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-2xl font-black italic uppercase leading-none">
            Apex Legends
            <br />
            <span className="text-spark-orange">Pro Series</span>
          </h3>
          <p className="mb-4 text-sm text-gray-300">Prize Pool: $10,000</p>
          <button className="w-full rounded-xl bg-white py-3 text-sm font-black italic text-gray-900 transition-transform hover:scale-105 active:scale-95">
            JOIN TOURNAMENT
          </button>
        </div>
      </div>
    </div>
  );
}
