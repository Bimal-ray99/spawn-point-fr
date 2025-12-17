"use client";

export function SlantedTab({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-12 min-w-[160px] px-8 text-lg font-black italic tracking-tighter transition-all ${
        isActive ? "z-10 text-white" : "text-gray-500 hover:text-gray-700"
      }`}
      style={{
        clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
        marginLeft: "-20px", // Overlap effect
      }}
    >
      <div
        className={`absolute inset-0 -z-10 ${
          isActive ? "bg-gray-900" : "bg-gray-200"
        }`}
      />
      {/* Top Accent Line */}
      {isActive && (
        <div className="absolute left-0 top-0 h-1 w-full bg-spark-cyan" />
      )}
      {label}
    </button>
  );
}
