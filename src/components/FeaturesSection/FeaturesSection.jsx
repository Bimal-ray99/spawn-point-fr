"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Copy from "../Copy/Copy";

const features = [
  { id: "01", title: "EXCLUSIVE DISCOUNTS ON ALL PRODUCTS AND SERVICES" },
  { id: "02", title: "GET MINING ACCESS FOR SPAWN COINS" },
  { id: "03", title: "PRIORITY BOOKING FOR ALL TOURNAMENTS" },
  { id: "04", title: "ACCESS TO EXCLUSIVE GAMING EVENTS" },
];

export default function FeaturesSection() {
  const section2Ref = useRef(null);

  // Scroll animation only for vertical text
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });

  const verticalTextY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <>
      {/* SECTION 1 — BLUE TITLE AREA */}
      <section className="relative py-20 md:py-32 min-h-screen overflow-hidden bg-primary">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <p className="text-white/30 text-sm md:text-base">
              [CASSETTE IMAGE PLACEHOLDER]
            </p>
          </div>

          <Copy delay={0.2}>
            <h2
              className="
              text-center 
              text-white 
              font-DurkBold 
              uppercase
              text-[clamp(2rem,6vw,4rem)]
              leading-[0.85]
              tracking-[-0.02em]
              mt-16
            "
            >
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
        className="relative py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b
    from-primary
    via-[#7da3ff]
    to-white"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* LEFT SIDE — VERTICAL SCROLLING TEXT + TITLE */}
            <div className="lg:w-1/2 relative">
              {/* Vertical scrolling text */}
              <motion.div
                style={{ y: verticalTextY }}
                className="hidden lg:block absolute -left-12 xl:-left-16 top-1/2 -translate-y-1/2"
              >
                <div
                  className="whitespace-nowrap origin-center"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <span className="font-DurkBold text-7xl xl:text-8xl tracking-[0.3em] text-black/10 uppercase">
                    CORE FEATURES
                  </span>
                </div>
              </motion.div>

              {/* Mobile label */}
              <div className="lg:hidden mb-8">
                <span className="inline-flex items-center gap-3 text-primary font-mono text-sm uppercase tracking-wider font-bold">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  CORE FEATURES
                </span>
              </div>

              {/* Main title */}
              <h2 className="font-DurkBold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-black uppercase">
                FEATURES WE'VE
                <br /> BUILT SO
                <br /> YOU GET MORE
                <br /> VALUE
              </h2>
            </div>

            {/* RIGHT SIDE — CARDS */}
            <div className="lg:w-1/2 flex items-center">
              <div className="w-full space-y-6 md:space-y-8">
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
      className="
        relative bg-white 
        border border-black/10
        shadow-[0_5px_20px_rgba(0,0,0,0.08)]
        rounded-xl
        p-6 md:p-8
        transition-all duration-500
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        hover:scale-[1.02]
        hover:bg-secondary
        cursor-pointer
      "
    >
      <span className="text-xs md:text-sm font-mono tracking-wider text-black/50 uppercase block mb-4">
        [ Feature {feature.id} ]
      </span>

      <h3 className="font-DurkBold text-xl sm:text-2xl md:text-3xl leading-snug text-black uppercase">
        {feature.title}
      </h3>
    </motion.div>
  );
}
