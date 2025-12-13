"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const multiplayerModes = [
  {
    title: "COUCH CO-OP",
    games: "DIRT 5 | FC 26 | GRAN TURISMO 7 | MORTAL KOMBAT 1",
    description: "Gather your squad for local multiplayer chaos.",
    image: "/img.webp",
  },
  {
    title: "ONLINE MULTIPLAYER",
    games: "FORTNITE | PUBG | CALL OF DUTY | FC 26",
    description: "Compete against the world in high-speed lobbies.",
    image: "/img.webp",
  },
];

function MultiplayerCard({ mode, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="relative group"
    >
      {/* Card Content */}
      <div
        className="relative bg-primary p-12 md:p-16 lg:p-24 min-h-[200px] md:min-h-[280px] overflow-hidden"
        style={{
          WebkitMaskImage: "url('/mask-1920.svg')",
          WebkitMaskSize: "cover",
          maskImage: "url('/mask-1920.svg')",
          maskSize: "cover",
        }}
      >
        {/* Right Side Image - Bigger */}
        <div className="absolute right-0 top-0 h-full w-1/2 z-[2] pointer-events-none hidden md:block">
          <div className="relative h-full w-full">
            <Image
              src={mode.image}
              alt=""
              fill
              className="object-cover object-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
            />
            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
          </div>
        </div>

        {/* Mira Image - Center */}
        <div className="absolute left-1/2 -translate-x-1/3 top-5 w-[30vw] z-[30] pointer-events-none hidden md:block">
          <Image
            src="/home/mira.png"
            alt=""
            width={600}
            height={800}
            className="h-full w-[30vw] object-contain object-bottom opacity-100 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-2xl">
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-DurkItalic uppercase text-white mb-4 leading-[0.85] group-hover:scale-[1.02] transition-transform origin-left">
              {mode.title}
            </h3>
            <p className="text-xl md:text-2xl text-white/80 font-medium mb-6 max-w-lg">
              {mode.description}
            </p>

            {/* Games List */}
            <div className="flex flex-wrap gap-3">
              {mode.games.split(" | ").map((game, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/10 text-white text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  {game}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GameModes() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background Element */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/elements/bgele.svg"
          alt=""
          fill
          className="object-cover opacity-100"
          aria-hidden="true"
        />
      </div>

      <div className="w-full px-4 md:px-8 relative z-10">
        {/* Multiplayer Modes - Full Width */}
        <div className="flex flex-col gap-6">
          {multiplayerModes.map((mode, index) => (
            <MultiplayerCard key={index} mode={mode} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
