"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";

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
    },
    {
      title: "LAST OF US ROGUE LIKE WIN",
      reward: "20 COINS",
      id: 2,
      type: "DAILY",
    },
    {
      title: "FC26 - WIN AGAINST LEGENDARY AI",
      reward: "20 COINS",
      id: 3,
      type: "DAILY",
    },
  ],
  weekly: [
    {
      title: "EARN 3 VICTORY CROWNS IN FORTNITE",
      reward: "50 COINS",
      id: 4,
      type: "WEEKLY",
    },
    {
      title: "WIN 5 MATCHES IN FC ONLINE - RANDOM",
      reward: "50 COINS",
      id: 5,
      type: "WEEKLY",
    },
    {
      title: "WIN 5 MATCHES WAR ZONE - RANDOM",
      reward: "50 COINS",
      id: 6,
      type: "WEEKLY",
    },
  ],
  crowned: [
    {
      title: "LAST OF US ROGUE LIKE WIN - GROUNDED",
      reward: "1000 COINS",
      id: 7,
      featured: true,
      type: "CROWNED",
    },
    {
      title: "SACKBOY CHALLENGE",
      reward: "5000 COINS",
      id: 8,
      featured: true,
      type: "CROWNED",
    },
    {
      title: "FORTNITE FESTIVAL - EARN FLAWLESS IN EXPERT",
      reward: "2000 COINS",
      id: 9,
      featured: true,
      type: "CROWNED",
    },
  ],
};

export default function Challenges() {
  const [activeTab, setActiveTab] = useState(CHALLENGE_TYPES.DAILY);
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-background"
    >
      {/* Background Scrolling Text */}
      <div className="absolute top-20 left-0 w-full opacity-[0.03] pointer-events-none select-none">
        <ScrollingText
          text="CHALLENGES CHALLENGES"
          direction="leftToRight"
          className="font-DurkItalic text-[15vw] leading-none text-black whitespace-nowrap"
          scrollTrigger={sectionRef}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
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

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-DurkItalic uppercase text-base-500 leading-[0.85]"
            >
              CHALLENGES
            </motion.h2>
          </div>

          {/* Custom Tab Navigation */}
          <div className="flex bg-white p-2 rounded-full border border-base-200 shadow-lg">
            {[
              { key: CHALLENGE_TYPES.DAILY, label: "DAILY" },
              { key: CHALLENGE_TYPES.WEEKLY, label: "WEEKLY" },
              { key: CHALLENGE_TYPES.CROWNED, label: "CROWNED" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300
                  ${
                    activeTab === tab.key
                      ? "text-white"
                      : "text-base-400 hover:text-base-500"
                  }
                `}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {challengesData[activeTab].map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border border-base-200 p-8 hover:border-primary transition-colors duration-300"
                style={{
                  boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.05)",
                }}
              >
                {/* Hover Effect - Hard Shadow Move */}
                <div className="absolute inset-0 bg-white transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 border border-transparent group-hover:border-primary z-0" />

                <div className="relative z-10">
                  {/* Top Meta */}
                  <div className="flex justify-between items-start mb-8">
                    <span className="font-mono text-xs text-base-300 uppercase tracking-wider">
                      {String(index + 1).padStart(2, "0")} — {challenge.type}
                    </span>
                    {challenge.featured && (
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black uppercase leading-tight text-base-500 mb-12 min-h-[4rem] group-hover:text-primary transition-colors">
                    {challenge.title}
                  </h3>

                  {/* Bottom Action */}
                  <div className="flex items-end justify-between border-t border-base-200 pt-6 group-hover:border-primary/20 transition-colors">
                    <div>
                      <p className="font-mono text-[10px] text-base-350 uppercase tracking-wider mb-1">
                        Reward
                      </p>
                      <p className="text-xl font-black text-primary">
                        {challenge.reward}
                      </p>
                    </div>

                    <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.16699 7.00033H12.8337M12.8337 7.00033L7.00033 1.16699M12.8337 7.00033L7.00033 12.8337"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
          <button className="group relative px-10 py-4 bg-base-500 text-white font-bold uppercase tracking-wider hover:bg-primary transition-colors duration-300 overflow-hidden">
            <span className="relative z-10">View All Challenges</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
