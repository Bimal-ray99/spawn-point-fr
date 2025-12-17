"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import ShapeDeco from "@/components/ShapeDeco";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import "./Challenges.css";

const CHALLENGE_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  CROWNED: "crowned",
};

const challengesData = {
  daily: [
    {
      title: "WIN A BATTLE ROYAL MATCH",
      reward: "20 COINS",
      id: 1,
      type: "DAILY",
      image: "/img.webp",
    },
    {
      title: "LAST OF US ROGUE LIKE WIN",
      reward: "20 COINS",
      id: 2,
      type: "DAILY",
      image: "/img.webp",
    },
    {
      title: "FC26 - WIN AGAINST LEGENDARY AI",
      reward: "20 COINS",
      id: 3,
      type: "DAILY",
      image: "/img.webp",
    },
  ],
  weekly: [
    {
      title: "EARN 3 VICTORY CROWNS IN FORTNITE",
      reward: "50 COINS",
      id: 4,
      type: "WEEKLY",
      image: "/img.webp",
    },
    {
      title: "WIN 5 MATCHES IN FC ONLINE - RANDOM",
      reward: "50 COINS",
      id: 5,
      type: "WEEKLY",
      image: "/img.webp",
    },
    {
      title: "WIN 5 MATCHES WAR ZONE - RANDOM",
      reward: "50 COINS",
      id: 6,
      type: "WEEKLY",
      image: "/img.webp",
    },
  ],
  crowned: [
    {
      title: "LAST OF US ROGUE LIKE WIN - GROUNDED",
      reward: "1000 COINS",
      id: 7,
      featured: true,
      type: "CROWNED",
      image: "/img.webp",
    },
    {
      title: "SACKBOY CHALLENGE",
      reward: "5000 COINS",
      id: 8,
      featured: true,
      type: "CROWNED",
      image: "/img.webp",
    },
    {
      title: "FORTNITE FESTIVAL - EARN FLAWLESS IN EXPERT",
      reward: "2000 COINS",
      id: 9,
      featured: true,
      type: "CROWNED",
      image: "/img.webp",
    },
  ],
};

export default function Challenges() {
  const [activeTab, setActiveTab] = useState(CHALLENGE_TYPES.DAILY);
  const heroSectionRef = useRef(null);
  const cardsSectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for Mira character
  const miraY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <>
      {/* SECTION 1: Hero Section with Scrolling Text and Mira */}
      <section
        ref={heroSectionRef}
        className="relative overflow-hidden bg-primary h-[50vh] flex items-start justify-center"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/elements/bgele.svg"
            alt=""
            fill
            className="object-cover opacity-[10%]"
            aria-hidden="true"
          />
        </div>
        {/* Halftone Pattern Background */}
        <div className="absolute inset-0 z-[1] halftone-animated opacity-15" />

        {/* Halftone Overlay Image */}
        <div className="absolute inset-0 z-[2] halftone-overlay opacity-[8%]" />

        {/* Single Big Scrolling Text - Below Image at Bottom */}
        <ScrollingText
          text="Challenges"
          direction="rightToLeft"
          className="absolute font-DurkItalic uppercase tracking-wider text-white pointer-events-none leading-none text-[clamp(8rem,28vw,24rem)] bottom-[4rem] left-20 z-[20] drop-shadow-xl"
          scrollTrigger={heroSectionRef}
          startX="100%"
          endX="-20%"
        />

        {/* Central Mira Character - Bigger (80vh), overflow hidden clips it */}
        <motion.div
          style={{ y: miraY }}
          className="relative z-[30] flex items-start justify-center"
        >
          <Image
            src="/home/mira.png"
            alt="Mira"
            width={900}
            height={1200}
            className="w-[35vw] h-auto object-contain object-top"
            priority
          />
        </motion.div>

        {/* ShapeDeco - bottom right */}
        <div className="z-50">
          <ShapeDeco
            position="bottom-right"
            primaryColor="bg-background"
            height={80}
            width="35%"
          />
        </div>
      </section>

      {/* SECTION 2: Cards Section */}
      <section
        ref={cardsSectionRef}
        className="relative py-16 md:py-24 overflow-hidden bg-background"
      >
        {/* Background Element - bgele.svg */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/elements/bgele.svg"
            alt=""
            fill
            className="object-cover opacity-[50%]"
            aria-hidden="true"
          />
        </div>

        <div className="mask-left-corner absolute bottom-0 right-0 z-10 h-1/2 w-[30%] rotate-180 bg-primary" />
        <div className="mask-right-corner absolute bottom-0 left-0 z-10 h-1/2 w-[30%] rotate-180 bg-primary" />

        <div className="max-w-7xl mx-auto px-6 relative z-[50]">
          {/* Header Section with Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="h-[2px] w-12 bg-primary" />
                <span className="font-mono text-primary tracking-widest uppercase text-sm font-bold">
                  Compete & Earn
                </span>
              </motion.div>
            </div>

            {/* Parallelogram Tab Navigation */}
            <div
              className="flex bg-white/10 backdrop-blur-sm p-1.5 gap-0 border border-base-200/20 rounded-xl"
              style={{
                transform: "skewX(-8deg)",
              }}
            >
              {[
                { key: CHALLENGE_TYPES.DAILY, label: "DAILY" },
                { key: CHALLENGE_TYPES.WEEKLY, label: "WEEKLY" },
                { key: CHALLENGE_TYPES.CROWNED, label: "CROWNED" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative px-8 py-3 font-bold text-sm tracking-wide transition-all duration-300 rounded-lg"
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      activeTab === tab.key
                        ? "text-white"
                        : "text-base-400 hover:text-base-500"
                    }`}
                    style={{
                      transform: "skewX(8deg)",
                      display: "inline-block",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Cards - Vertically Stacked */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 max-w-5xl mx-auto"
            >
              {challengesData[activeTab].map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="group relative w-full"
                >
                  {/* Hard shadow */}
                  <div
                    className="absolute inset-0 bg-primary group-hover:bg-secondary translate-y-3 translate-x-3 transition-all duration-300"
                    style={{
                      WebkitMaskImage: "url('/mask-1920.svg')",
                      WebkitMaskSize: "cover",
                      maskImage: "url('/mask-1920.svg')",
                      maskSize: "cover",
                    }}
                  />

                  <div className="absolute inset-0 z-[1] halftone-animated opacity-35" />

                  {/* Main card - masked with stroke and gradient */}
                  <div
                    className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2 border-gray-200/50 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:border-primary/30 group-hover:shadow-lg"
                    style={{
                      WebkitMaskImage: "url('/mask-1920.svg')",
                      WebkitMaskSize: "cover",
                      maskImage: "url('/mask-1920.svg')",
                      maskSize: "cover",
                    }}
                  >
                    {/* Game Image on Left - Full height */}
                    <div className="absolute left-0 top-0 bottom-0 w-28 md:w-36 flex items-center justify-center overflow-hidden">
                      <Image
                        src={challenge.image}
                        alt={challenge.title}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 mix-blend-multiply" />

                    {/* Content - Horizontal layout */}
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full pl-32 md:pl-40">
                      <div className="flex-1 mb-4 md:mb-0">
                        <span className="font-mono text-xs text-base-300 uppercase tracking-wider block mb-2">
                          {String(index + 1).padStart(2, "0")} —{" "}
                          {challenge.type}
                        </span>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black uppercase leading-tight text-base-500 group-hover:text-primary transition-colors">
                          {challenge.title}
                        </h3>
                      </div>

                      {/* Reward + Arrow */}
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-left md:text-right">
                          <p className="font-mono text-[10px] text-base-350 uppercase tracking-wider mb-1">
                            Reward
                          </p>
                          <p className="text-xl md:text-2xl font-black text-primary">
                            {challenge.reward}
                          </p>
                        </div>

                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M1.167 7h11.666M12.833 7L7 1.167M12.833 7L7 12.833"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <div className="mt-20 mb-12 flex justify-center">
            <AnimatedButton label="View All" route="/challenges" />
          </div>
        </div>
      </section>
    </>
  );
}
