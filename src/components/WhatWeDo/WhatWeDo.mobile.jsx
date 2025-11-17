"use client";
import { useRef } from "react";
import "./WhatWeDo.css";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "@/components/Copy/Copy";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";

export default function WhatWeDoMobile() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const characterY = useTransform(scrollYProgress, [0, 1], ["20%", "-5%"]);

  return (
    <div
      className="text-offblack relative flex min-h-screen flex-col-reverse overflow-hidden bg-background"
      ref={sectionRef}
    >
      <div className="relative bottom-12 z-40 ml-4">
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-end pb-20 text-center">
          <Copy delay={0.2}>
            <h1 className="font-DurkBoldItalic uppercase text-primary py-6">
              Enter the
            </h1>
          </Copy>

          <div className="w-full flex justify-center">
            <div
              className="
    what-we-do-main-heading
    relative
    inline-flex
    items-center
    justify-center
    px-10
    py-2
    overflow-visible
  "
            >
              <div className="bg-ele absolute inset-0 z-0"></div>

              <Copy delay={0.2}>
                <h1 className="relative z-10 text-white leading-none font-DurkBoldItalic">
                  ARENA
                </h1>
              </Copy>
            </div>
          </div>

          <Copy delay={0.5}>
            <p className="what-we-do-description max-w-[320px] px-4">
              Dominate the battlefield, outplay your rivals, and claim your
              legacy.{" "}
              <span className="what-we-do-highlight">The Arena awaits!</span>
            </p>
          </Copy>
        </div>
      </div>
      <div className="absolute inset-0 -left-32 top-[12rem] z-0 flex items-end">
        <ScrollingText
          text="EnterThe"
          direction="leftToRight"
          className="absolute font-DurkItalic uppercase tracking-wider text-primary pointer-events-none z-0 leading-none text-[20rem] top-[2rem] left-[-20rem]"
          scrollTrigger={sectionRef}
        />
      </div>

      {/* Character with parallax - FIXED */}
      <motion.div
        style={{ y: characterY }}
        className="absolute z-30 inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[125vw]">
          <Image
            src="/home/mira.png"
            alt=""
            width={800}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </motion.div>

      <div
        className="absolute right-0 top-0 z-10 w-[65%] bg-primary"
        style={{
          clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute z-30 flex items-end">
          <ScrollingText
            text="EnterThe"
            direction="rightToLeft"
            className="absolute font-DurkItalic uppercase tracking-wider text-white pointer-events-none z-0 leading-none text-[20rem] top-[-4rem] left-[-8rem]"
            scrollTrigger={sectionRef}
          />
        </div>
        <div className="halftone-overlay opacity-30" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="min-h-screen w-full object-cover opacity-20"
        >
          <source src="/home/hero-4.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Additional UI Elements */}
      <div
        className="absolute left-[50px] top-10 z-50 flex items-center"
        aria-label="Timer display"
      >
        <div className="h-3.5 w-3.5 bg-primary" />
        <div className="px-2 text-sm font-bold tracking-widest text-primary">
          00:19:00
        </div>
      </div>
      {/* Gradient overlay for mobile */}
      <div
        className="absolute bottom-0 z-30 block h-[65%] w-full bg-gradient-to-t from-background via-background to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
