"use client";

export function LeaderboardRow({ rank, name, points, isMe }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
        isMe ? "bg-spark-cyan/5 ring-1 ring-spark-cyan/20" : "hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black italic ${
          rank === 1
            ? "bg-yellow-100 text-yellow-600"
            : rank === 2
            ? "bg-gray-100 text-gray-600"
            : rank === 3
            ? "bg-orange-100 text-orange-600"
            : "text-gray-400"
        }`}
      >
        #{rank}
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <p
          className={`text-sm font-bold ${
            isMe ? "text-spark-cyan" : "text-gray-900"
          }`}
        >
          {name} {isMe && "(You)"}
        </p>
        <p className="text-xs text-gray-500">Level 42</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-black italic text-gray-900">{points}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase">Points</p>
      </div>
    </div>
  );
}
