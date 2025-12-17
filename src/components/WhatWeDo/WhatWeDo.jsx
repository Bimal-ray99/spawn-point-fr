"use client";
import "./WhatWeDo.css";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "@/components/Copy/Copy";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";

export default function WhatWeDo() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const characterY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section ref={sectionRef} className="what-we-do">
      {/* Timer UI Element */}
      <div className="what-we-do-timer">
        <div className="what-we-do-timer-dot"></div>
        <span>00:19:00</span>
      </div>

      {/* Main Content Grid */}
      <div className="what-we-do-grid">
        {/* Left Side - Text Content */}
        <div className="what-we-do-text-side">
          {/* Background Image */}
          <div className="what-we-do-left-bg">
            <Image
              src="/elements/bgele.svg"
              alt=""
              fill
              className="object-cover opacity-[50%]"
              aria-hidden="true"
            />
          </div>

          <div className="what-we-do-text-content">
            <div className="what-we-do-heading-wrapper">
              <Copy delay={0.1}>
                <h2 className="what-we-do-small-heading font-DurkItalic font-bold leading-4 uppercase tracking-normal">
                  SIGN UP <n /> SPAWN <n /> COMPETE!
                </h2>
              </Copy>

              {/* <div className="what-we-do-main-heading">
                <div className="bg-ele"></div>
                <Copy delay={0.2}>
                  <h1>ARENA</h1>
                </Copy>
              </div> */}
            </div>

            <Copy delay={0.3}>
              <p className="what-we-do-description">
                REGISTER FOR UPCOMING{" "}
                <span className="what-we-do-highlight">EVENTS</span>
              </p>
            </Copy>
          </div>

          {/* Decorative Text Background - Left Scrolling */}
          <div
            className="absolute inset-0 bottom-0 z-0 flex items-end overflow-hidden"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            <ScrollingText
              text="EnterThe"
              direction="leftToRight"
              className="absolute font-DurkItalic uppercase tracking-wider text-transparent stroke-text pointer-events-none z-0 leading-none text-[clamp(8rem,20vw,20rem)] bottom-[-6rem] right-80"
              scrollTrigger={sectionRef}
            />
          </div>
        </div>

        {/* Right Side - Video/Visual Section */}
        <div className="what-we-do-visual-side">
          <motion.div style={{ y: videoY }} className="what-we-do-video-wrap">
            <div className="halftone-overlay opacity-[3%]"></div>
            <video autoPlay loop muted playsInline className="what-we-do-video">
              <source src="/home/hero-4.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Large Background Text - Right Scrolling */}
          <ScrollingText
            text="EnterTheArena"
            direction="rightToLeft"
            className="absolute font-DurkItalic uppercase tracking-wider text-white pointer-events-none leading-none text-[clamp(10rem,25vw,20rem)] top-[-7rem] -left-44 z-20"
            scrollTrigger={sectionRef}
          />
        </div>

        {/* Character Image - Overlapping both sections */}
        <motion.div
          ref={characterRef}
          style={{ y: characterY }}
          className="what-we-do-character"
        >
          <Image
            src="/home/mira.png"
            alt="Gaming Character"
            width={550}
            height={550}
            className="what-we-do-character-img"
            priority
          />
        </motion.div>
      </div>

      {/* Decorative UI Elements */}
      <div className="what-we-do-ui-dot what-we-do-ui-dot-top"></div>
      <div className="what-we-do-ui-dot what-we-do-ui-dot-bottom"></div>

      {/* Hashtag Element */}
      <div className="what-we-do-hashtag">
        <div className="what-we-do-hashtag-line text-primary"></div>
        <span>#GAMINGLEAGUE</span>
      </div>

      {/* Decorative Corner Mask */}
      <div className="mask-left-corner absolute bottom-0 right-0 z-10 h-1/2 w-[30%] rotate-180 bg-gray-200" />
    </section>
  );
}
