"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  Users,
  Swords,
  ChevronRight,
  Loader2,
  Medal,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("open"); // open, ongoing, completed

  useEffect(() => {
    fetchTournaments();
  }, [filter]);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `/api/profile/tournaments?status=${filter}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setTournaments(data.data?.tournaments || []);
      } else {
        toast.error(data.error?.message || "Failed to load tournaments");
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error("Failed to load tournaments");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500 text-white";
      case "ongoing":
        return "bg-spark-orange text-white";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const featuredTournament = Array.isArray(tournaments)
    ? tournaments.find((t) => t.isFeatured) || tournaments[0]
    : null;

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
              Tournaments
            </h1>
            <p className="text-gray-500 font-bold mt-2">
              Compete for glory and prizes
            </p>
          </div>
        </div>

        {/* Featured Tournament Hero */}
        {!isLoading && featuredTournament && filter === "open" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />

            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-[url('/images/tournament-bg.jpg')] bg-cover bg-center opacity-50" />

            <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-spark-cyan/20 px-4 py-1.5 text-sm font-bold text-spark-cyan border border-spark-cyan/30">
                  <Trophy className="h-4 w-4" />
                  FEATURED TOURNAMENT
                </div>

                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                  {featuredTournament.title}
                </h2>

                <p className="text-gray-300 text-lg max-w-xl line-clamp-3">
                  {featuredTournament.description}
                </p>

                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-spark-cyan" />
                    {new Date(
                      featuredTournament.startDate
                    ).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-spark-cyan" />
                    {featuredTournament.participants?.length || 0} /{" "}
                    {featuredTournament.maxParticipants} Players
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-spark-orange" />
                    {featuredTournament.prizePool} Prize Pool
                  </div>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/profile/tournaments/${featuredTournament._id}`
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-spark-cyan px-8 py-4 font-black uppercase tracking-wider text-white transition-all hover:bg-spark-cyan/90 hover:scale-105 shadow-lg shadow-spark-cyan/25"
                >
                  Join Tournament
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Game Icon/Banner */}
              <div className="hidden md:block w-64 h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-spark-cyan to-spark-orange rounded-3xl opacity-20 blur-2xl animate-pulse" />
                <div className="relative h-full w-full rounded-3xl bg-gray-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <Swords className="h-24 w-24 text-white/20" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {["open", "ongoing", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                filter === status
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
          </div>
        ) : tournaments.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white p-12 text-center shadow-xl">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-gray-200" />
            <h3 className="text-xl font-black text-gray-900">
              No tournaments found
            </h3>
            <p className="text-gray-500 mt-2">
              Check back later for new tournaments!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(tournaments) &&
              tournaments.map((tournament) => (
                <motion.div
                  key={tournament._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() =>
                    router.push(`/profile/tournaments/${tournament._id}`)
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-2xl bg-gray-100 p-3">
                      <Swords className="h-6 w-6 text-gray-700" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-black text-gray-900 line-clamp-1">
                    {tournament.title}
                  </h3>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                      <Users className="h-4 w-4" />
                      {tournament.participants?.length || 0} /{" "}
                      {tournament.maxParticipants}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Prize Pool
                      </p>
                      <p className="text-lg font-black text-spark-orange">
                        {tournament.prizePool}
                      </p>
                    </div>
                    <button className="rounded-xl bg-gray-900 p-2 text-white transition-transform group-hover:scale-110">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
