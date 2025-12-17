"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    id: "01",
    title: "TOP TIER GEAR",
    description:
      "Elite-level performance with premium PCs, pro peripherals, and next-gen consoles.",
    image: "https://placehold.co/800x600/1a1a1a/FFF?text=Top+Tier+Gear",
    color: "bg-blue-600",
  },
  {
    id: "02",
    title: "GAMING BAR",
    description:
      "Sip on cocktails and specialty drinks inspired by the games you love.",
    image: "https://placehold.co/400x400/2a2a2a/FFF?text=Gaming+Bar",
    color: "bg-purple-600",
  },
  {
    id: "03",
    title: "CONSTANT ACTION",
    description:
      "Packed tournaments and casual vibes. The energy is never off.",
    image: "https://placehold.co/400x400/3a3a3a/FFF?text=Constant+Action",
    color: "bg-orange-600",
  },
];

export default function BuiltDifferent() {
  return (
    <section className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl md:text-9xl font-black uppercase text-black leading-[0.85] tracking-tighter">
              BUILT
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                DIFFERENT
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-sm text-right"
          >
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Every detail is crafted to give you something unforgettable.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px]">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-[2rem] bg-gray-900 ${
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : "md:col-span-1 md:row-span-1"
              }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold">
                    {feature.id}
                  </div>

                  {/* Arrow Icon */}
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 leading-none tracking-tight drop-shadow-lg">
                    {feature.title}
                  </h3>

                  <div className="max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed max-w-[90%] drop-shadow-md pb-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover Border */}
              <div
                className={`absolute inset-0 border-4 ${feature.color.replace(
                  "bg-",
                  "border-"
                )} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] pointer-events-none z-20`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
