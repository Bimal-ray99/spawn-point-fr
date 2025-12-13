"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ShapeDeco from "@/components/ShapeDeco";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturedTournamentCarousel from "./components/FeaturedTournamentCarousel";
import { sampleTournaments } from "./data/tournaments";
import { useTournamentFilter } from "./hooks/useTournamentFilter";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import "./Tournament.css";

gsap.registerPlugin(ScrollTrigger);

export const Tournament = ({ tournaments = sampleTournaments }) => {
  const { featuredTournaments } = useTournamentFilter(tournaments);

  // Ref for the section we'll animate
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { backgroundColor: "#ffffff" },
      {
        backgroundColor: "#000000",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 50%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-24"
      aria-label="tournament Section"
    >
      {/* Background Scrolling Text */}
      <div className="absolute top-20 left-0 w-full opacity-[0.03] pointer-events-none select-none">
        <ScrollingText
          text="TOURNAMENTS TOURNAMENTS"
          direction="leftToRight"
          className="font-DurkItalic text-[15vw] leading-none text-white whitespace-nowrap"
          scrollTrigger={sectionRef}
        />
      </div>

      <div className="absolute inset-0 z-10 h-full mix-blend-screen">
        <Image
          src="/img.webp"
          alt=""
          fill
          className="h-full w-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-30">
        <FeaturedTournamentCarousel featuredTournaments={featuredTournaments} />

        <div className="flex justify-center mt-6 sm:mt-8">
          <AnimatedButton
            route="/tournament"
            label="View All Tournaments"
            animate={false}
          />
        </div>
      </div>

      <ShapeDeco
        position="top-left"
        primaryColor="bg-primary"
        height={50}
        width="40%"
      />
    </section>
  );
};

export default Tournament;
