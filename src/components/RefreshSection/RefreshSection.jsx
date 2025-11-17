"use client";

import { useRef } from "react";
import Image from "next/image";
import { ScrollingText } from "../ScrollingText/ScrollingText";
import { useScroll, useTransform, motion } from "framer-motion";
import Copy from "../Copy/Copy";

export const RefreshSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Rotate the food image based on scroll progress (0 to 360 degrees)
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-white"
      aria-label="Refresh Section"
    >
      {/* Scrolling background text */}
      <div className="rotate-[84deg]">
        <ScrollingText
          text="EnterThe"
          direction="leftToRight"
          className="absolute font-DurkItalic uppercase tracking-wider text-primary pointer-events-none z-0 leading-none text-[clamp(8rem,20vw,20rem)] bottom-[-50rem] right-80"
          scrollTrigger={sectionRef}
        />
      </div>

      {/* Blue masked block - Left side */}
      <div
        className="absolute left-0 top-0 z-10 bg-primary h-full w-[40%]"
        style={{
          clipPath: "polygon(0% 0%, 0% 0%, 10% 100%, 0% 100%)",
        }}
        aria-hidden="true"
      >
        <div className="halftone-overlay opacity-[3%]" />
        <div>
          <div className="halftone-overlay opacity-[5%]" />
          <img
            src="/home/img.webp"
            alt="wellness-sanctuary-image"
            className="min-h-screen w-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Main Content - Right Side Stacked Vertically */}
      <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end">
        {/* REFRESH */}
        <div className="relative text-right mb-2">
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary italic">
            REFRESH
          </h2>
        </div>

        {/* REFUEL */}
        <div className="relative text-right mb-2">
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary italic">
            REFUEL
          </h2>
        </div>

        {/* RESPAWN - With blue background and skew */}
        <div className="what-we-do-main-heading">
          <div className="bg-ele"></div>
          <Copy delay={0.2}>
            <h1>Respawn</h1>
          </Copy>
        </div>

        {/* Description Text */}
        <div className="max-w-xl lg:max-w-2xl text-right">
          <p className="text-sm md:text-base lg:text-lg font-semibold leading-relaxed text-gray-900 uppercase tracking-wide">
            FUEL YOUR GAME WITH MOUTH-WATERING BITES, COOL SHAKES, AND
            ENERGY-PACKED{" "}
            <span className="inline-block bg-primary px-2 py-1 text-white">
              TREATS—MADE FOR GAMERS, SERVED WITH FLAVOR.
            </span>
          </p>
        </div>
      </div>

      {/* Rotating Food Image - Left side */}
      <motion.div
        className="absolute top-1/4 left-12 md:left-20 lg:left-32 -translate-y-1/2 z-20"
        aria-hidden="true"
        ref={imageRef}
        style={{ rotate }}
      >
        <Image
          src="/home/food-01.png"
          alt="Gamer food plate"
          width={450}
          height={450}
          className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] object-contain"
          priority
        />
      </motion.div>

      {/* Decorative Elements - Floating ingredients */}
      <div className="absolute top-20 right-[35%] z-15">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Add strawberry or other decorative image here if needed */}
        </motion.div>
      </div>
    </section>
  );
};

export default RefreshSection;
