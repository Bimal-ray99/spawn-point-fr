"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  Users,
  Swords,
  ChevronLeft,
  Loader2,
  Medal,
  Timer,
  Share2,
  Info,
  List,
  GitBranch,
  CreditCard,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [tournament, setTournament] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myEnrollment, setMyEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTournamentDetails();
    fetchMyEnrollment();
  }, [id]);

  useEffect(() => {
    if (activeTab === "bracket" && !bracket) fetchBracket();
    if (activeTab === "leaderboard" && leaderboard.length === 0)
      fetchLeaderboard();
  }, [activeTab]);

  const fetchTournamentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTournament(data.data);
      } else {
        toast.error("Failed to load tournament details");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBracket = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/tournaments/${id}/bracket`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBracket(data.data);
    } catch (error) {
      console.error("Error fetching bracket:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/tournaments/${id}/leaderboard?limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) setLeaderboard(data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchMyEnrollment = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/tournaments/${id}/my-enrollment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyEnrollment(data.data);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
    }
  };

  const fetchUserAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const [cardsRes, teamsRes] = await Promise.all([
        fetch("/api/profile/cards", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/profile/teams/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const cardsData = await cardsRes.json();
      const teamsData = await teamsRes.json();

      if (cardsData.success) {
        setCards(cardsData.data.cards.filter((c) => c.status === "active"));
        const active = cardsData.data.cards.find((c) => c.status === "active");
        if (active) setSelectedCard(active);
      }

      if (teamsData.success) {
        const teams = Array.isArray(teamsData.data)
          ? teamsData.data
          : teamsData.data?.teams || [];
        setMyTeams(teams);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const handleEnrollClick = () => {
    fetchUserAssets();
    setShowEnrollModal(true);
  };

  const handleEnroll = async () => {
    if (!selectedCard) {
      toast.error("Please select a card for entry fee");
      return;
    }
    if (tournament.type === "team" && !selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    setIsEnrolling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/tournaments/${id}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardId: selectedCard._id,
          teamId: selectedTeam?._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Successfully enrolled!");
        setShowEnrollModal(false);
        fetchMyEnrollment();
        fetchTournamentDetails();
      } else {
        toast.error(data.error?.message || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw from this tournament?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/tournaments/${id}/withdraw`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Successfully withdrawn");
        setMyEnrollment(null);
        fetchTournamentDetails();
      } else {
        toast.error(data.error?.message || "Failed to withdraw");
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error("Failed to withdraw");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
      </div>
    );
  }

  if (!tournament) return null;

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Tournaments
        </button>

        {/* Hero Section */}
        <div className="mb-8 relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('/images/tournament-bg.jpg')] bg-cover bg-center opacity-50" />

          <div className="relative z-20 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-spark-cyan/20 px-4 py-1.5 text-sm font-bold text-spark-cyan border border-spark-cyan/30 uppercase">
                  <Trophy className="h-4 w-4" />
                  {tournament.status}
                </div>

                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                  {tournament.title}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-spark-cyan" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-spark-cyan" />
                    {tournament.participants?.length || 0} /{" "}
                    {tournament.maxParticipants} Players
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-spark-orange" />
                    {tournament.prizePool} Prize Pool
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                {myEnrollment ? (
                  <button
                    onClick={handleWithdraw}
                    className="w-full rounded-2xl bg-red-500/20 px-6 py-4 font-bold text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all"
                  >
                    Withdraw
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    disabled={tournament.status !== "open"}
                    className="w-full rounded-2xl bg-spark-cyan px-8 py-4 font-black uppercase tracking-wider text-white transition-all hover:bg-spark-cyan/90 hover:scale-105 shadow-lg shadow-spark-cyan/25 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {tournament.status === "open"
                      ? "Join Tournament"
                      : "Registration Closed"}
                  </button>
                )}
                <button className="w-full rounded-2xl bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-gray-200 pb-1">
          {[
            { id: "overview", label: "Overview", icon: Info },
            { id: "bracket", label: "Bracket", icon: GitBranch },
            { id: "leaderboard", label: "Leaderboard", icon: List },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-spark-orange text-spark-orange"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8 md:grid-cols-3"
            >
              <div className="md:col-span-2 space-y-8">
                <section className="rounded-[2rem] bg-white p-8 shadow-lg">
                  <h3 className="mb-4 text-xl font-black uppercase text-gray-900">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tournament.description}
                  </p>
                </section>

                <section className="rounded-[2rem] bg-white p-8 shadow-lg">
                  <h3 className="mb-4 text-xl font-black uppercase text-gray-900">
                    Rules
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {tournament.rules?.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    )) || <li>Standard tournament rules apply.</li>}
                  </ul>
                </section>
              </div>

              <div className="space-y-8">
                <section className="rounded-[2rem] bg-white p-8 shadow-lg">
                  <h3 className="mb-4 text-xl font-black uppercase text-gray-900">
                    Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-bold">Format</span>
                      <span className="font-bold text-gray-900 uppercase">
                        {tournament.format || "Single Elimination"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-bold">Entry Fee</span>
                      <span className="font-bold text-spark-orange">
                        {tournament.entryFee || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-bold">Team Size</span>
                      <span className="font-bold text-gray-900">
                        {tournament.teamSize || "1v1"}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === "bracket" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] bg-white p-8 shadow-lg overflow-x-auto"
            >
              {/* Placeholder Bracket Visualization */}
              <div className="min-w-[800px] flex justify-between items-center gap-8 py-12">
                {/* Round 1 */}
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((match) => (
                    <div
                      key={match}
                      className="w-48 rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-900">
                          Player A
                        </span>
                        <span className="font-bold text-gray-500">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">
                          Player B
                        </span>
                        <span className="font-bold text-gray-500">0</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Round 2 */}
                <div className="space-y-24">
                  {[1, 2].map((match) => (
                    <div
                      key={match}
                      className="w-48 rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-900">TBD</span>
                        <span className="font-bold text-gray-500">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">TBD</span>
                        <span className="font-bold text-gray-500">-</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Final */}
                <div>
                  <div className="w-48 rounded-xl border-2 border-spark-orange bg-white p-3 shadow-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-900">TBD</span>
                      <span className="font-bold text-gray-500">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">TBD</span>
                      <span className="font-bold text-gray-500">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] bg-white p-8 shadow-lg"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-left text-sm uppercase text-gray-500">
                    <th className="pb-4 pl-4">Rank</th>
                    <th className="pb-4">Participant</th>
                    <th className="pb-4 text-right pr-4">Score/Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 pl-4 font-black text-gray-900">
                          #{idx + 1}
                        </td>
                        <td className="py-4 font-bold text-gray-700">
                          {entry.name || "Unknown"}
                        </td>
                        <td className="py-4 text-right pr-4 font-bold text-spark-cyan">
                          {entry.score || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 text-center text-gray-400 font-bold"
                      >
                        No leaderboard data available yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enroll Modal */}
      <AnimatePresence>
        {showEnrollModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnrollModal(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase text-gray-900">
                  Join Tournament
                </h2>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Entry Fee Info */}
                <div className="rounded-2xl bg-gray-50 p-4 flex justify-between items-center">
                  <span className="font-bold text-gray-600">Entry Fee</span>
                  <span className="font-black text-xl text-spark-orange">
                    {tournament.entryFee || 0} pts
                  </span>
                </div>

                {/* Card Selection */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Select Payment Card
                  </label>
                  {cards.length > 0 ? (
                    <div className="space-y-2">
                      {cards.map((card) => (
                        <div
                          key={card._id}
                          onClick={() => setSelectedCard(card)}
                          className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                            selectedCard?._id === card._id
                              ? "border-spark-cyan bg-spark-cyan/5"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">
                              {card.name}
                            </span>
                            <span className="text-sm font-bold text-gray-500">
                              {card.balancePoints} pts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm font-bold">
                      No active cards found. Please create one first.
                    </p>
                  )}
                </div>

                {/* Team Selection (if applicable) */}
                {tournament.type === "team" && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Select Team
                    </label>
                    {myTeams.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {myTeams.map((team) => (
                          <div
                            key={team._id}
                            onClick={() => setSelectedTeam(team)}
                            className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                              selectedTeam?._id === team._id
                                ? "border-spark-cyan bg-spark-cyan/5"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">
                                {team.name}
                              </span>
                              <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full">
                                {team.tag}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm font-bold">
                        No teams found. Please create or join a team.
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleEnroll}
                  disabled={
                    isEnrolling ||
                    !selectedCard ||
                    (tournament.type === "team" && !selectedTeam)
                  }
                  className="w-full rounded-xl bg-spark-cyan py-4 text-lg font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-spark-cyan/90 disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {isEnrolling ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
