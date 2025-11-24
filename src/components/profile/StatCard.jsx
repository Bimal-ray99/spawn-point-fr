"use client";

export function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    orange: "text-orange-500 bg-orange-50",
    cyan: "text-cyan-500 bg-cyan-50",
    purple: "text-purple-500 bg-purple-50",
    yellow: "text-yellow-500 bg-yellow-50",
  };

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className={`mb-4 inline-flex rounded-xl p-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-black italic text-gray-900">{value}</p>
    </div>
  );
}
