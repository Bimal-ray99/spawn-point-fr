"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const vrModes = [
  {
    title: "VR RACING",
    equipment: "THRUSTMASTER T300 + PS VR2",
    icon: "🏎️",
    description: "Feel every turn and drift with haptic feedback.",
  },
  {
    title: "VR/MR ACTION",
    equipment: "PS VR 2 + QUEST3(S) + HAPTIC VEST",
    icon: "⚔️",
    description: "Immerse yourself in the battlefield.",
  },
  {
    title: "VR SPORTS",
    equipment: "META QUEST 3 + CRICKET BAT",
    icon: "🏏",
    description: "Swing for the fences in realistic stadiums.",
  },
];

const multiplayerModes = [
  {
    title: "COUCH CO-OP",
    games: "DIRT 5 | FC 26 | GRAN TURISMO 7 | MORTAL KOMBAT 1",
    description: "Gather your squad for local multiplayer chaos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "ONLINE MULTIPLAYER",
    games: "FORTNITE | PUBG | CALL OF DUTY | FC 26",
    description: "Compete against the world in high-speed lobbies.",
    color: "from-purple-500 to-pink-500",
  },
];

function VRCard({ mode, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-8 rounded-[2rem] bg-gray-50 border border-gray-200 hover:border-purple-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-9xl grayscale group-hover:grayscale-0 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform">
        {mode.icon}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
            {mode.icon}
          </div>
          <h3 className="text-2xl font-black uppercase text-gray-900 mb-2 tracking-tight">
            {mode.title}
          </h3>
          <p className="font-medium text-gray-500 text-sm mb-4">
            {mode.description}
          </p>
        </div>

        <div className="pt-6 border-t border-gray-200/60">
          <p className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
            {mode.equipment}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MultiplayerCard({ mode, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-200 p-10 md:p-14 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
    >
      {/* Hover Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="max-w-xl">
          <h3 className="text-4xl md:text-5xl font-black uppercase text-gray-900 mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
            {mode.title}
          </h3>
          <p className="text-lg text-gray-500 font-medium mb-6">
            {mode.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-bold font-mono uppercase tracking-wider group-hover:bg-white group-hover:shadow-md transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available Now
          </div>
        </div>

        <div className="w-full md:w-auto border-l-0 md:border-l border-gray-200 pl-0 md:pl-8 pt-6 md:pt-0">
          <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Featured Games
          </p>
          <p className="font-bold text-gray-800 text-sm leading-relaxed max-w-xs">
            {mode.games.split(" | ").join(" • ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function GameModes() {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-xs font-bold font-mono uppercase tracking-widest mb-6">
              Next-Gen Experience
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-gray-900 tracking-tighter mb-6">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Reality
              </span>
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              From high-speed VR racing to intense multiplayer battles, we have
              the ultimate setup for every type of gamer.
            </p>
          </motion.div>
        </div>

        {/* VR Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {vrModes.map((mode, index) => (
            <VRCard key={index} mode={mode} index={index} />
          ))}
        </div>

        {/* Multiplayer Modes */}
        <div className="flex flex-col gap-6">
          {multiplayerModes.map((mode, index) => (
            <MultiplayerCard key={index} mode={mode} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
