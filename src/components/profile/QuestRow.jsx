"use client";

import { Check, Trophy, Gift, Loader2 } from "lucide-react";

export function QuestRow({
  title,
  reward,
  type,
  status, // "not-started", "in-progress", "completed", "claimable", "claimed"
  progress,
  total,
  onJoin,
  onClaim,
  isLoading,
}) {
  const isCompleted =
    status === "completed" || status === "claimable" || status === "claimed";
  const isClaimable = status === "claimable";
  const isClaimed = status === "claimed";
  const isInProgress = status === "in-progress";

  const typeColors = {
    daily: "bg-blue-100 text-blue-600",
    weekly: "bg-purple-100 text-purple-600",
    special: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* Left Accent Bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${
          isClaimed
            ? "bg-gray-300"
            : isCompleted
            ? "bg-green-500"
            : isClaimable
            ? "bg-spark-orange"
            : "bg-spark-cyan"
        }`}
      />

      <div className="flex items-center justify-between gap-4 pl-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isCompleted ? (
              <Check className="h-6 w-6" />
            ) : (
              <Trophy className="h-5 w-5" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-black italic uppercase ${
                  typeColors[type] || "bg-gray-100 text-gray-600"
                }`}
              >
                {type}
              </span>
              {isInProgress && (
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-black italic text-orange-600">
                  IN PROGRESS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isInProgress ? (
            <div className="w-32 text-right">
              <div className="mb-1 flex justify-end gap-1 text-xs font-bold text-gray-500">
                <span>{progress}</span>/<span>{total}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-spark-cyan"
                  style={{
                    width: `${Math.min((progress / total) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
              <Gift className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-black italic text-gray-900">
                {reward} XP
              </span>
            </div>
          )}

          {isClaimable ? (
            <button
              onClick={onClaim}
              disabled={isLoading}
              className="rounded-lg bg-spark-orange px-6 py-2 text-sm font-black italic text-white shadow-lg shadow-spark-orange/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "CLAIM"
              )}
            </button>
          ) : isClaimed ? (
            <button
              disabled
              className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-black italic text-gray-400"
            >
              CLAIMED
            </button>
          ) : isCompleted ? (
            // Should not happen if logic is correct, but fallback
            <button
              disabled
              className="rounded-lg bg-green-500 px-6 py-2 text-sm font-black italic text-white opacity-50"
            >
              COMPLETED
            </button>
          ) : (
            <button
              onClick={onJoin}
              disabled={isLoading}
              className="rounded-lg bg-spark-cyan/10 px-6 py-2 text-sm font-black italic text-spark-cyan hover:bg-spark-cyan hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "START QUEST"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
