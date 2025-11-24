"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function GlobalBackground() {
  const pathname = usePathname();
  const hideCharacter =
    pathname === "/profile/cards" || pathname === "/profile/booking";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Geometric Shards/Lightning */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M20 0 L35 0 L25 100 L10 100 Z" className="fill-blue-900" />
          <path d="M40 0 L45 0 L35 100 L30 100 Z" className="fill-blue-900" />
          <path d="M85 0 L100 0 L90 100 L75 100 Z" className="fill-blue-900" />
        </svg>
      </div>

      {/* Character Image */}
      {!hideCharacter && (
        <div className="absolute -right-20 bottom-0 h-[90vh] w-auto select-none opacity-100">
          <Image
            src="/home/mira.png"
            alt="Character"
            width={800}
            height={1000}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      )}
    </div>
  );
}
