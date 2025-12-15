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

function FullScreenMode({ mode, index }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={mode.image}
          alt={mode.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* Black Gradient Overlay at Bottom */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Content - Positioned at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-[2] p-8 md:p-16 lg:p-24"
      >
        <div className="max-w-4xl">
          {/* Title */}
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-DurkItalic uppercase text-white mb-4 leading-[0.85]">
            {mode.title}
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-NeueMontreal mb-8 max-w-2xl">
            {mode.description}
          </p>

          {/* Games Tags */}
          <div className="flex flex-wrap gap-3">
            {mode.games.split(" | ").map((game, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors cursor-pointer"
              >
                {game}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function GameModes() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="relative">
      {/* Full Screen Mode Sections */}
      {multiplayerModes.map((mode, index) => (
        <FullScreenMode key={index} mode={mode} index={index} />
      ))}
    </section>
  );
}
