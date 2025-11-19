"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "../Copy/Copy";
import { ScrollingText } from "../ScrollingText/ScrollingText";
import "./FeaturesSection.css";

const features = [
  { id: "01", title: "EXCLUSIVE DISCOUNTS ON ALL PRODUCTS AND SERVICES" },
  { id: "02", title: "GET MINING ACCESS FOR SPAWN COINS" },
  { id: "03", title: "PRIORITY BOOKING FOR ALL TOURNAMENTS" },
  { id: "04", title: "ACCESS TO EXCLUSIVE GAMING EVENTS" },
];

export default function FeaturesSection() {
  const section2Ref = useRef(null);

  return (
    <>
      {/* SECTION 1 — BLUE TITLE AREA */}
      <section className="relative section-spacing min-h-screen overflow-hidden bg-primary">
        <div className="bg-ele"></div>
        <div className="content-container">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-white/5 rounded-2xl flex-center backdrop-blur-sm border border-white/10">
            <p className="body-sm text-white/30">
              [CASSETTE IMAGE PLACEHOLDER]
            </p>
          </div>

          <Copy delay={0.2}>
            <h2 className="heading-display-lg text-center text-white font-DurkBold uppercase leading-[0.85] tracking-[-0.02em] mt-16">
              Unlock More with
              <br />
              Your Keycard
            </h2>
          </Copy>
        </div>
      </section>

      {/* SECTION 2 — FEATURES */}
      <section
        ref={section2Ref}
        className="relative section-spacing-lg overflow-hidden bg-gradient-to-b from-primary via-white to-white"
      >
        <div className="content-container">
          <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 lg:items-center">
            {/* LEFT SIDE — VERTICAL SCROLLING TEXT + TITLE */}
            <div className="relative">
              {/* Vertical scrolling text */}
              <div className="rotate-90">
                <ScrollingText
                  text="EnterTheArena"
                  direction="rightToLeft"
                  className="absolute font-DurkItalic uppercase tracking-wider text-primary pointer-events-none z-0 leading-none text-[clamp(8rem,20vw,20rem)] md:top-[35vh] top-20 md:right-[-70rem] right-12"
                  scrollTrigger={section2Ref}
                />
              </div>

              {/* Mobile label */}
              <div className="lg:hidden mb-8">
                <span className="inline-flex items-center gap-3 text-primary font-mono text-sm uppercase tracking-wider font-bold">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  CORE FEATURES
                </span>
              </div>

              {/* Main title */}
              <h2 className="heading-display-lg font-DurkBold leading-[0.85] text-black uppercase relative z-10 lg:ml-12 xl:ml-24">
                FEATURES WE'VE
                <br /> BUILT SO
                <br /> YOU GET MORE
                <br /> VALUE
              </h2>
            </div>

            {/* RIGHT SIDE — CARDS */}
            <div className="lg:w-[55%] xl:w-[58%]">
              <div className="w-full max-w-card-lg xl:max-w-2xl gap-content-sm">
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ feature }) {
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.9", "end 0.2"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y }}
      className="feature-card group relative bg-white/90 backdrop-blur-sm border-2 border-black/20 rounded-2xl card-padding-lg hover:bg-secondary hover:border-secondary cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(255,23,217,0.3)] mb-6"
    >
      {/* Halftone background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: 'url("/elements/halftone.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
        }}
      />

      {/* Content */}
      <div className="relative text-center z-10">
        <span className="fluid-text-xs font-mono tracking-[0.2em] text-black/60 group-hover:text-black/80 uppercase transition-colors duration-500 block mb-4">
          [ FEATURE {feature.id} ]
        </span>

        <h3 className="heading-card font-DurkBold leading-[1.1] text-black group-hover:text-black transition-all duration-500 uppercase">
          {feature.title}
        </h3>
      </div>

      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-bl-full" />
    </motion.div>
  );
}
