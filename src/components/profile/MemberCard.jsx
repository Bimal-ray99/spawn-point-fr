"use client";

import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export function MemberCard({ user, card, tier, qrCode }) {
  const hasCard = !!card;
  const tierName = tier?.name || "Base Tier";
  const tierLevel = card?.level || tier?.level || 1;

  return (
    <Link href="/profile/cards" className="block w-full max-w-md">
      <div className="relative h-[240px] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-2xl transition-transform hover:scale-[1.02]">
        {/* Blue Gradient - Top Right */}
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-spark-cyan blur-[60px]" />

        {/* Red Gradient - Bottom Left */}
        <div className="absolute left-0 bottom-0 h-32 w-32 translate-y-1/2 -translate-x-1/2 rounded-full bg-red-600 blur-[60px]" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Gamepad2 className="h-8 w-8 text-spark-cyan" />
            <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">
              MEMBER CARD
            </span>
          </div>

          {hasCard ? (
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                    AVAILABLE CREDITS
                  </p>
                  <p className="text-4xl font-black italic tracking-tight text-white">
                    {card.balancePoints?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-spark-orange to-yellow-500 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900 text-xs font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      {tierName} • Lvl {tierLevel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: QR Code & Card Number */}
              <div className="flex flex-col items-end gap-4">
                {qrCode && (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Card Number
                  </p>
                  <p className="text-sm font-mono font-bold text-white tracking-widest">
                    {card.cardNumber
                      ? `•••• ${card.cardNumber.slice(-4)}`
                      : "•••• ••••"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-lg font-bold text-gray-300 mb-2">
                No Card Found
              </p>
              <p className="text-sm text-gray-500">
                Please contact the desk to assign a card to your account.
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
