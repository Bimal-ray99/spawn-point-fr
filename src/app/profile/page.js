"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flame, Swords, Target, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SlantedTab } from "@/components/profile/SlantedTab";
import { QuestRow } from "@/components/profile/QuestRow";
import { LeaderboardRow } from "@/components/profile/LeaderboardRow";
import { StatCard } from "@/components/profile/StatCard";
import { TournamentCard } from "@/components/profile/TournamentCard";
import { MemberCard } from "@/components/profile/MemberCard";
import { ActionGrid } from "@/components/profile/ActionGrid";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | stats
  const [questFilter, setQuestFilter] = useState("daily"); // daily | weekly

  const [activeBooking, setActiveBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch Profile
        const profileRes = await fetch("/api/profile", { headers });

        if (profileRes.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          toast.error("Session expired. Please login again.");
          return;
        }

        const profileData = await profileRes.json();

        if (profileData.success) {
          setUser(profileData.data.user);
          localStorage.setItem("user", JSON.stringify(profileData.data.user));
          window.dispatchEvent(new Event("user-updated"));
        } else {
          toast.error("Failed to load profile");
        }

        // Fetch Cards
        const cardsRes = await fetch("/api/profile/cards", { headers });
        const cardsData = await cardsRes.json();

        if (cardsData.success) {
          setCards(cardsData.data.cards || []);
        }

        // Fetch Active Booking
        const bookingsRes = await fetch(
          "/api/profile/bookings/mine?page=1&limit=20",
          { headers }
        );
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success && bookingsData.data.data) {
          const active = bookingsData.data.data.find(
            (b) =>
              b.status === "scheduled" ||
              b.status === "active" ||
              b.status === "in_progress"
          );
          if (active) {
            setActiveBooking(active);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!activeBooking) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(
        new Date(
          new Date(activeBooking.startAt).getTime() +
            activeBooking.durationMinutes * 60000
        )
      );
      const diff = end - now;

      if (diff <= 0) {
        return "Finished";
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBooking]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-spark-orange border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-gray-900 selection:bg-spark-orange selection:text-white">
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
        {/* Slanted Tabs */}
        <div className="mb-8 flex items-end border-b-4 border-gray-900/10">
          <SlantedTab
            label="OVERVIEW"
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SlantedTab
            label="STATS"
            isActive={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
          />
        </div>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Welcome & Game Card */}
                <div className="col-span-2 space-y-6">
                  {/* Active Booking Banner */}
                  {activeBooking && (
                    <div className="mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white shadow-2xl">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                            </span>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                              Active Booking
                            </p>
                          </div>
                          <h2 className="text-3xl font-black italic uppercase">
                            {activeBooking.systemId?.name ||
                              activeBooking.system?.name ||
                              "System"}
                          </h2>
                          <p className="text-gray-400">
                            {new Date(
                              activeBooking.startAt || activeBooking.startTime
                            ).toLocaleDateString()}{" "}
                            •{" "}
                            {new Date(
                              activeBooking.startAt || activeBooking.startTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase text-gray-500">
                              Time Remaining
                            </p>
                            <p className="text-3xl font-black text-white tabular-nums">
                              {timeLeft}
                            </p>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() =>
                                router.push(
                                  `/profile/booking/${activeBooking._id}`
                                )
                              }
                              className="rounded-full bg-spark-cyan px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-spark-cyan/90 hover:scale-105"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50">
                    <h1 className="mb-2 text-4xl font-black italic uppercase tracking-tighter text-gray-900">
                      Welcome Back,{" "}
                      <span className="text-spark-orange">
                        {user.name || user.username}
                      </span>
                      !
                    </h1>
                    <p className="text-lg font-medium text-gray-500">
                      Ready to dominate the arena today?
                    </p>
                  </div>

                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Game Card */}
                    <MemberCard user={user} card={cards[0]} />

                    {/* Action Grid */}
                    <ActionGrid />
                  </div>
                </div>

                {/* Tournament Card (Persistent Requirement) */}
                <div className="col-span-1">
                  <TournamentCard />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={Flame}
                  label="Total Points"
                  value={user.totalPointsSpent || 0}
                  color="orange"
                />
                <StatCard
                  icon={Swords}
                  label="Tournaments"
                  value={user.totalTournaments || 0}
                  color="cyan"
                />
                <StatCard
                  icon={Target}
                  label="Bookings"
                  value={user.totalBookings || 0}
                  color="purple"
                />
                <StatCard
                  icon={Trophy}
                  label="Wins"
                  value="12"
                  color="yellow"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Sections: Quests & Leaderboard */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Quests Section */}
          <div className="col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-gray-900">
                Active Quests
              </h2>
              <div className="flex rounded-lg bg-white p-1 shadow-sm">
                <button
                  onClick={() => setQuestFilter("daily")}
                  className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                    questFilter === "daily"
                      ? "bg-spark-cyan text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  DAILY
                </button>
                <button
                  onClick={() => setQuestFilter("weekly")}
                  className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                    questFilter === "weekly"
                      ? "bg-spark-purple text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  WEEKLY
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <QuestRow
                title="Reach Season Level 37"
                reward="400 XP"
                type="RARE"
                status="completed"
              />
              <QuestRow
                title="Collector Score - 10,000+"
                reward="400 XP"
                type="EPIC"
                status="completed"
              />
              <QuestRow
                title="Win 3 Matches in Arena"
                reward="900 XP"
                type="RARE"
                status="in-progress"
                progress={1}
                total={3}
              />
              <QuestRow
                title="Follow us on X"
                reward="200 XP"
                type="LEGENDARY"
                status="claimable"
              />
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-gray-900">
                Leaderboard
              </h2>
              <button className="text-xs font-bold text-spark-cyan hover:underline">
                VIEW ALL
              </button>
            </div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/50">
              <div className="p-2">
                <LeaderboardRow rank={1} name="Mamang Ironman" points="156" />
                <LeaderboardRow rank={2} name="TinyToolsTea" points="121" />
                <LeaderboardRow rank={3} name="xxJevarzxx" points="98" />
                <LeaderboardRow rank={4} name="Bimal Ray" points="85" isMe />
                <LeaderboardRow rank={5} name="ProGamer99" points="72" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
