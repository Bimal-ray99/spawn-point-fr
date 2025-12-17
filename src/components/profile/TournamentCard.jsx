"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Loader2 } from "lucide-react";

export function TournamentCard() {
  const router = useRouter();
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "/api/profile/tournaments?status=open&limit=1",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success && data.data?.tournaments?.length > 0) {
          setTournament(data.data.tournaments[0]);
        }
      } catch (error) {
        console.error("Error fetching featured tournament:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTournament();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl bg-gray-900 text-white shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-spark-orange" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="relative h-full overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        <div className="relative z-10 flex h-full flex-col justify-center items-center p-6 text-center">
          <h3 className="text-xl font-black italic uppercase text-gray-500">
            No Active Tournaments
          </h3>
          <p className="text-sm text-gray-400 mt-2">Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      {/* Placeholder image - ideally this comes from tournament.image */}
      <div className="absolute inset-0 bg-[url('/images/apex.jpg')] bg-cover bg-center opacity-50" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex justify-between">
          <span className="rounded-lg bg-green-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {tournament.status}
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 backdrop-blur-md">
            <Users className="h-3 w-3 text-gray-300" />
            <span className="text-xs font-bold">
              {tournament.participants?.length || 0}/
              {tournament.maxParticipants}
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-2xl font-black italic uppercase leading-none line-clamp-2">
            {tournament.title}
          </h3>
          <p className="mb-4 text-sm text-gray-300">
            Prize Pool:{" "}
            <span className="text-spark-orange">{tournament.prizePool}</span>
          </p>
          <button
            onClick={() =>
              router.push(`/profile/tournaments/${tournament._id}`)
            }
            className="w-full rounded-xl bg-white py-3 text-sm font-black italic text-gray-900 transition-transform hover:scale-105 active:scale-95"
          >
            JOIN TOURNAMENT
          </button>
        </div>
      </div>
    </div>
  );
}
