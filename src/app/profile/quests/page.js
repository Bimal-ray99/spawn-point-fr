"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { QuestRow } from "@/components/profile/QuestRow";

export default function QuestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("daily"); // daily, weekly
  const [quests, setQuests] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // questId

  useEffect(() => {
    fetchQuests();
  }, [activeTab]);

  const fetchQuests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch quests based on tab
      const questsRes = await fetch(`/api/profile/quests/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const questsData = await questsRes.json();

      // Fetch user participations
      const participationsRes = await fetch(
        "/api/profile/quests/my-participations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const participationsData = await participationsRes.json();

      if (questsData.success) {
        setQuests(questsData.data || []);
      }
      if (participationsData.success) {
        setParticipations(participationsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
      toast.error("Failed to load quests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (questId) => {
    setActionLoading(questId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/quests/${questId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Quest started!");
        fetchQuests(); // Refresh data
      } else {
        toast.error(data.error?.message || "Failed to join quest");
      }
    } catch (error) {
      toast.error("Failed to join quest");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClaim = async (questId) => {
    setActionLoading(questId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/quests/${questId}/claim-reward`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Reward claimed!");
        fetchQuests(); // Refresh data
      } else {
        toast.error(data.error?.message || "Failed to claim reward");
      }
    } catch (error) {
      toast.error("Failed to claim reward");
    } finally {
      setActionLoading(null);
    }
  };

  const getQuestStatus = (quest) => {
    const participation = participations.find((p) => p.questId === quest._id);
    if (!participation) return "not-started";
    if (participation.rewardClaimed) return "claimed";
    if (participation.isWinner) return "claimable";
    if (participation.completed) return "completed"; // Completed but not winner/claimable yet
    return "in-progress";
  };

  const getProgress = (quest) => {
    const participation = participations.find((p) => p.questId === quest._id);
    return participation ? participation.progress : 0;
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
              Active Quests
            </h1>
            <p className="text-gray-500 font-bold mt-2">
              Complete challenges to earn XP and rewards
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-white p-1 shadow-sm">
            {["daily", "weekly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-6 py-2 text-sm font-black uppercase transition-all ${
                  activeTab === tab
                    ? "bg-spark-cyan text-white shadow-md"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Quests List */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
          </div>
        ) : quests.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white p-12 text-center shadow-xl">
            <Swords className="mx-auto mb-4 h-16 w-16 text-gray-200" />
            <h3 className="text-xl font-black text-gray-900">
              No active quests
            </h3>
            <p className="text-gray-500 mt-2">
              Check back later for new challenges!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(quests) &&
              quests.map((quest) => (
                <motion.div
                  key={quest._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <QuestRow
                    title={quest.title}
                    reward={quest.rewardPoints}
                    type={quest.type} // "daily" or "weekly" usually, but could be "RARE" etc if backend sends it
                    status={getQuestStatus(quest)}
                    progress={getProgress(quest)}
                    total={quest.requirements?.target || 100}
                    onJoin={() => handleJoin(quest._id)}
                    onClaim={() => handleClaim(quest._id)}
                    isLoading={actionLoading === quest._id}
                  />
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
