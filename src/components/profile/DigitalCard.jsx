"use client";

import { Gamepad2, Wifi } from "lucide-react";

export function DigitalCard({ card, user, qrCode, tier }) {
  const hasCard = !!card;
  const level = card?.level || tier?.level || 1;
  const tierName = tier?.name || "Member";

  if (!hasCard) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white shadow-2xl">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Gamepad2 className="mb-4 h-16 w-16 text-gray-600" />
          <h3 className="text-2xl font-bold text-gray-400">No Active Card</h3>
          <p className="mt-2 text-gray-500">
            Contact support to activate your membership card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-8 text-white shadow-2xl transition-transform hover:scale-[1.01]">
      {/* Background Effects */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/30 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-500/30 blur-[80px]" />

      {/* Texture/Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              Card Number
            </p>
            <p className="mt-1 font-mono text-xl font-bold tracking-widest text-white">
              {card.cardNumber}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Active
            </span>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              Balance Points
            </p>
            <h2 className="text-5xl font-black italic tracking-tighter text-white">
              {card.balancePoints?.toLocaleString()}
            </h2>
          </div>

          {/* Tier Info */}
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              Current Tier
            </p>
            <p className="text-xl font-bold text-white">
              {tierName} <span className="text-cyan-300">• Lvl {level}</span>
            </p>
          </div>
        </div>

        {/* Bottom - QR Code */}
        <div className="mt-6 flex items-center justify-center">
          <div className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-white p-4 shadow-lg">
            {qrCode ? (
              <img
                src={qrCode}
                alt="Card QR Code"
                className="h-full w-auto object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <Wifi className="h-8 w-8 animate-pulse" />
              </div>
            )}

            {/* Scan Me Label */}
            <div className="absolute -bottom-3 rounded-full bg-gray-900 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
              Scan to Pay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
