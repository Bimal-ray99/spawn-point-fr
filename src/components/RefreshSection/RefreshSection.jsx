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
      className="relative min-h-screen w-full overflow-hidden bg-background section-spacing"
      aria-label="Refresh Section"
    >
      {/* Background Elements - Full Section */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/elements/bgele.svg"
          alt=""
          fill
          className="object-cover opacity-50"
          aria-hidden="true"
        />
      </div>

      {/* Scrolling background text - Hidden on mobile */}
      <div className="hidden lg:block rotate-[84deg]">
        <ScrollingText
          text="EnterThe"
          direction="leftToRight"
          className="absolute font-DurkItalic uppercase tracking-wider text-primary pointer-events-none z-0 leading-none text-[clamp(8rem,20vw,20rem)] bottom-[-50rem] right-80"
          scrollTrigger={sectionRef}
        />
      </div>

      {/* Blue masked block - Left side - Hidden on mobile */}
      <div
        className="hidden lg:block absolute left-0 top-0 z-10 bg-primary h-full w-[40%]"
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

      {/* Mobile Version */}
      <div className="block lg:hidden">
        <div className="flex-col-center text-center content-container relative z-30">
          {/* REFRESH */}
          <div className="relative">
            <Copy delay={0.1}>
              <h2 className="heading-section pb-6 font-DurkBoldItalic uppercase leading-[0.85] text-primary italic">
                REFRESH
              </h2>
            </Copy>
          </div>

          {/* REFUEL */}
          <div className="relative -mt-2">
            <Copy delay={0.15}>
              <h2 className="heading-section pb-6 font-DurkBoldItalic uppercase leading-[0.85] text-primary italic">
                REFUEL
              </h2>
            </Copy>
          </div>

          {/* RESPAWN - With blue background and clip-path */}
          <div
            className="relative bg-primary text-white px-8 py-4 w-fit overflow-hidden font-DurkBoldItalic uppercase inline-block mt-2 before:content-[''] before:absolute before:inset-0 before:bg-[url('/elements/halftone.jpg')] before:bg-cover before:mix-blend-multiply before:opacity-10 before:pointer-events-none before:z-[1]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
            }}
          >
            {/* bg-ele layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
              <Image
                src="/elements/bgele.svg"
                alt=""
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <Copy delay={0.2}>
              <h2 className="heading-section leading-[0.85] relative z-10 italic">
                RESPAWN
              </h2>
            </Copy>
          </div>

          {/* Description Text */}
          <div className="mt-6 max-w-prose">
            <Copy delay={0.3}>
              <p className="body-sm text-gray-800 uppercase tracking-wide mb-4 font-semibold">
                FUEL YOUR GAME WITH MOUTH-WATERING BITES, COOL SHAKES, AND
                ENERGY-PACKED
              </p>
            </Copy>
            <div className="bg-primary text-white px-4 py-2 rounded inline-block">
              <p className="body-sm font-semibold uppercase">
                TREATS—MADE FOR GAMERS, SERVED WITH FLAVOR.
              </p>
            </div>
          </div>

          {/* Food Image - Mobile */}
          <motion.div
            className="mt-8 relative w-full flex justify-center"
            style={{ rotate }}
          >
            <Image
              src="/home/food-01.png"
              alt="Gamer food plate"
              width={350}
              height={350}
              className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Blue decorative block - Mobile */}
        <div
          className="absolute left-0 bottom-0 z-0 bg-primary h-[120px] w-full"
          style={{
            clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)",
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
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Main Content - Right Side Stacked Vertically */}
        <div className="absolute right-8 xl:right-24 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-content-xs">
          {/* REFRESH */}
          <div className="relative">
            <Copy delay={0.1}>
              <h2 className="heading-display-lg pb-6 font-DurkBoldItalic uppercase leading-[0.9] text-primary italic">
                REFRESH
              </h2>
            </Copy>
          </div>

          {/* REFUEL */}
          <div className="relative">
            <Copy delay={0.15}>
              <h2 className="heading-display-lg pb-6 font-DurkBoldItalic uppercase leading-[0.9] text-primary italic">
                REFUEL
              </h2>
            </Copy>
          </div>

          {/* RESPAWN - With blue background and clip-path */}
          <div
            className="relative bg-primary text-white px-6 py-3 md:px-8 md:py-4 w-fit overflow-hidden font-DurkBoldItalic uppercase inline-block before:content-[''] before:absolute before:inset-0 before:bg-[url('/elements/halftone.jpg')] before:bg-cover before:mix-blend-multiply before:opacity-10 before:pointer-events-none before:z-[1]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
            }}
          >
            {/* bg-ele layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
              <Image
                src="/elements/bgele.svg"
                alt=""
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <Copy delay={0.2}>
              <h2 className="heading-display-lg leading-[0.9] relative z-10 italic">
                RESPAWN
              </h2>
            </Copy>
          </div>

          {/* Description Text */}
          <div className="max-w-content text-right mt-6">
            <Copy delay={0.3}>
              <p className="body-lg font-semibold leading-relaxed text-gray-900">
                Fuel your game with mouth-watering bites, cool shakes, and
                energy-packed{" "}
                <span className="bg-primary text-white px-3 py-1 font-extrabold uppercase rounded whitespace-nowrap">
                  treats—made for gamers!
                </span>
              </p>
            </Copy>
          </div>
        </div>

        {/* Rotating Food Image - Left side - Desktop only */}
        <motion.div
          className="absolute top-1/4 left-32 -translate-y-1/2 z-20"
          aria-hidden="true"
          style={{ rotate }}
        >
          <Image
            src="/home/food-01.png"
            alt="Gamer food plate"
            width={750}
            height={750}
            className="w-[600px] h-[600px] object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default RefreshSection;
