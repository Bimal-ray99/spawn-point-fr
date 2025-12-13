"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import ShapeDeco from "@/components/ShapeDeco";

const steps = [
  {
    id: "01",
    title: "RECORD YOUR MINING SESSION",
    description: "Capture your gameplay evidence",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23 7L16 12L23 17V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="1"
          y="5"
          width="15"
          height="14"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "COMPLETE THE CHALLENGE",
    description: "Hit the targets and win",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 4L12 14.01L9 11.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "03",
    title: "CLAIM COINS ON THE APP",
    description: "Get rewarded instantly",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1V23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3688 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HowToClaim() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-primary"
    >
      {/* Background Scrolling Text */}
      <div className="absolute inset-0 flex flex-col justify-center opacity-[0.08] pointer-events-none select-none z-0">
        <motion.div style={{ x: x1 }} className="whitespace-nowrap">
          <span className="font-DurkItalic text-[20vw] leading-none text-white">
            HOW TO CLAIM HOW TO CLAIM
          </span>
        </motion.div>
        <motion.div style={{ x: x2 }} className="whitespace-nowrap">
          <span className="font-DurkItalic text-[20vw] leading-none text-white">
            REWARDS REWARDS REWARDS
          </span>
        </motion.div>
      </div>

      {/* Mira Image - Left Side with Low Z-Index */}
      <div className="absolute left-0 top-0 z-[1] pointer-events-none">
        <Image
          src="/home/mira.png"
          alt="Mira"
          width={900}
          height={1200}
          className="w-[35vw] h-auto object-contain object-top"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-white" />
            <span className="font-mono text-white tracking-widest uppercase text-sm font-bold">
              Process
            </span>
            <div className="h-[2px] w-12 bg-white" />
          </div>

          <h2 className="text-6xl md:text-8xl font-DurkItalic uppercase text-white leading-[0.85]">
            HOW TO CLAIM
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-base-200 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Step Number/Icon Circle */}
              <div className="w-24 h-24 mx-auto bg-white border-2 border-base-200 rounded-full flex items-center justify-center mb-8 group-hover:border-primary group-hover:scale-110 transition-all duration-300 shadow-lg">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-mono text-xs font-bold">
                  {step.id}
                </div>
              </div>

              {/* Content */}
              <div
                className="text-center bg-white p-8 border border-base-200 hover:border-primary transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] min-h-[160px] flex flex-col justify-center"
                style={{
                  WebkitMaskImage: "url('/mask-1920.svg')",
                  WebkitMaskSize: "cover",
                  maskImage: "url('/mask-1920.svg')",
                  maskSize: "cover",
                }}
              >
                <h3 className="text-2xl font-black uppercase leading-tight text-base-500 mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="font-mono text-sm text-base-350 uppercase tracking-wide">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ShapeDeco - Bottom Right */}
      <div className="z-[20]">
        <ShapeDeco
          position="bottom-right"
          primaryColor="bg-background"
          height={80}
          width="30%"
        />
      </div>
    </section>
  );
}
