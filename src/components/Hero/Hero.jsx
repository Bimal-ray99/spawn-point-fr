import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import useMaskImage from "@/hooks/useMaskImage";
import { useRef } from "react";

export default function Hero({ showPreloader }) {
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
    <section ref={containerRef} className="hero">
      <motion.div style={{ y, maskImage }} className="hero-bg">
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
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/home/hero-image-overlay.webp"
          alt="Overlay"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-100 pointer-events-none"
        />
      </div>
      {/* <div className="hero-gradient"></div> */}
      <div className="hero-corner-top">
        <Image src="/home/top-left-ele1.webp" alt="" width={400} height={400} />
      </div>

      <div className="hero-corner-bottom">
        <Image
          src="/home/bottom-right-element1.webp"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-header">
            <Copy animateOnScroll={false} delay={showPreloader ? 8 : 0.85}>
              <h1>Spawn Point</h1>
            </Copy>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col h-[22vh]">
        <div className="flex justify-between items-center padding-x gap-[10px]">
          <div className="absolute bottom-32 left-0 right-0 z-20 ">
            <div className="text-center mb-4 md:mb-6">
              <p className="text-white paragraph font-normal tracking-normal font-NeueMontreal leading-[0.85em] md:leading-[1em] transition-transform duration-200">
                Games available on
              </p>
            </div>
            {/* Platform logos for larger screens */}
            <div className="justify-center items-center gap-4 md:gap-8 flex-wrap hidden md:flex ">
              {[
                {
                  src: "/home/platforms/playstation.webp",
                  alt: "PlayStation",
                  height: "h-6",
                },
                {
                  src: "/home/platforms/xbox.webp",
                  alt: "Xbox",
                  height: "h-7",
                },
                {
                  src: "/home/platforms/nintendo-switch.webp",
                  alt: "Nintendo Switch",
                  height: "h-8",
                },
                {
                  src: "/home/platforms/steam.webp",
                  alt: "Steam",
                  height: "h-8",
                },
                {
                  src: "/home/platforms/epic.png",
                  alt: "Epic Games",
                  height: "h-8",
                },
              ].map((platform, index) => (
                <div key={index}>
                  <div className={platform.height}>
                    <Image
                      src={platform.src}
                      alt={platform.alt}
                      width={100}
                      height={50}
                      className="h-full w-auto"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Platform logos for mobile */}
            <div className="justify-center items-center gap-4 md:gap-8 flex-wrap flex md:hidden">
              {[
                {
                  src: "/home/platforms/ps-mini.webp",
                  alt: "PlayStation",
                },
                { src: "/home/platforms/xbox-mini.webp", alt: "Xbox" },
                {
                  src: "/home/platforms/nintendo-mini.webp",
                  alt: "Nintendo Switch",
                },
                {
                  src: "/home/platforms/steam-mini.webp",
                  alt: "Steam",
                },
                { src: "/home/platforms/epic.png", alt: "Epic Games" },
              ].map((platform, index) => (
                <div key={index}>
                  <div className="h-6 md:h-8">
                    <Image
                      src={platform.src}
                      alt={platform.alt}
                      width={50}
                      height={30}
                      className="h-full w-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
