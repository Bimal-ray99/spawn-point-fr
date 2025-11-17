"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useMaskImage from "@/hooks/useMaskImage";
import Marquee from "@/components/Marquee";

export default function Hero() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "50vh start"],
  });

  const maskImage = useMaskImage(scrollYProgress, false, {
    divisions: 24,
    inset: 0.15,
    gap: 0.3,
    vh: 100,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-secondary"
    >
      {/* Background Video (Masked + Parallax) */}
      <motion.div
        style={{ y, maskImage }}
        className="absolute inset-0 pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/home/hero-4.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Industrial-Standard Infinite Marquee */}
      <Marquee
        baseSpeed={2}
        className="absolute bottom-0 left-0 w-full leading-[0.8] z-10"
      >
        <span className="text-white font-DurkItalic italic text-[35vh] sm:text-[38vw] md:text-[20vw] tracking-[0.05em] px-4 md:px-8">
          SPAWN POINT ·
        </span>
        <span className="text-white font-DurkItalic italic text-[35vh] sm:text-[38vw] md:text-[20vw] tracking-[0.05em] px-4 md:px-8">
          SPAWN POINT ·
        </span>
      </Marquee>
    </section>
  );
}
