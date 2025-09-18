"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function HeroDesktop() {
  const [isLoaded, setIsLoaded] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const platformsRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "50vh start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);

      // GSAP animations after loading
      const titleWords = titleRef.current?.querySelectorAll("span");

      const subtitleSplit = new SplitText(subtitleRef.current, {
        type: "words",
        wordsClass: "split-word",
      });

      const platformElements =
        platformsRef.current?.querySelectorAll(".platform-item");

      // Set initial states
      gsap.set(titleWords, {
        opacity: 0,
        y: 100,
        rotationX: -90,
      });
      gsap.set(subtitleSplit.words, {
        opacity: 0,
        y: 30,
      });
      gsap.set(platformElements, {
        opacity: 0,
        y: 20,
      });

      // Animate title words (SPAWN first, then POINT)
      gsap.to(titleWords, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.5,
      });

      // Animate subtitle
      gsap.to(subtitleSplit.words, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 1.2,
      });

      // Animate platforms
      gsap.to(platformElements, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 1.8,
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Platform hover effects
  useEffect(() => {
    const platformElements =
      platformsRef.current?.querySelectorAll(".platform-item");

    platformElements?.forEach((element) => {
      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.1,
          y: -3,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.inOut",
        });
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
      id="video-frame"
    >
      <div className="w-full h-full flex flex-col justify-between">
        <div />
        <div className="w-full flex flex-col justify-between md:h-[100vh] h-[85vh]">
          {/* Video Background - No mask, just parallax */}
          <motion.div
            style={{ y }}
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
          >
            <video
              className="w-full h-full object-cover min-w-full min-h-full"
              poster="/images/bg/main-home-rev-3.png"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/hero-4.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Hero Image Overlay */}
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <Image
              src="/images/bg/hero-image-overlay.webp"
              alt="Overlay"
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-100 pointer-events-none"
            />
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 z-10">
            <Image
              src="/images/bg/top-left-ele1.webp"
              alt="Corner decoration"
              width={500}
              height={500}
              className="w-auto h-auto"
              priority
            />
          </div>

          <div className="absolute bottom-0 right-0 z-10">
            <Image
              src="/images/bg/bottom-right-element1.webp"
              alt="Corner decoration"
              width={300}
              height={300}
              className="w-auto h-auto"
              priority
            />
          </div>

          {/* Main Title Section - Using original padding-y equivalent */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full py-[100px] lg:py-[80px] md:py-[120px] sm:py-[60px] xm:py-[40px]">
            <div className="text-center">
              <h1
                ref={titleRef}
                className="text-white font-extrabold tracking-normal transition-transform duration-200"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(60px, 25vw, 250px)",
                  lineHeight: "0.85",
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  fontWeight: "900",
                }}
              >
                <span className="block md:inline">SPAWN </span>
                <span className="block md:inline md:ml-4">POINT</span>
              </h1>
            </div>
          </div>

          {/* Bottom Section - Platform Logos */}
          <div className="w-full flex flex-col h-[22vh]">
            <div className="flex justify-between items-center px-[50px] md:px-[30px] sm:px-[20px] xm:px-[20px] gap-[10px]">
              <div className="absolute md:bottom-12 bottom-8 left-0 right-0 z-20">
                {/* Description */}
                <div className="text-center mb-4 md:mb-6">
                  <p
                    ref={subtitleRef}
                    className="text-white font-normal tracking-normal transition-transform duration-200"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(16px, 2vw, 18px)",
                      lineHeight: "1.6",
                    }}
                  >
                    Games available on
                  </p>
                </div>

                {/* Platform logos for larger screens */}
                <div
                  ref={platformsRef}
                  className="justify-center items-center gap-6 md:gap-12 flex-wrap hidden md:flex"
                >
                  {[
                    {
                      src: "/images/platforms/playstation.webp",
                      alt: "PlayStation",
                      width: 60,
                      height: 40,
                    },
                    {
                      src: "/images/platforms/xbox.webp",
                      alt: "Xbox",
                      width: 50,
                      height: 50,
                    },
                    {
                      src: "/images/platforms/nintendo-switch.webp",
                      alt: "Nintendo Switch",
                      width: 60,
                      height: 60,
                    },
                    {
                      src: "/images/platforms/steam.webp",
                      alt: "Steam",
                      width: 60,
                      height: 60,
                    },
                    {
                      src: "/images/platforms/epic.png",
                      alt: "Epic Games",
                      width: 60,
                      height: 60,
                    },
                  ].map((platform, index) => (
                    <div
                      key={index}
                      className="platform-item cursor-pointer"
                      style={{ height: "clamp(40px, 5vw, 60px)" }}
                    >
                      <Image
                        src={platform.src}
                        alt={platform.alt}
                        width={platform.width}
                        height={platform.height}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Platform logos for mobile */}
                <div className="justify-center items-center gap-6 flex-wrap flex md:hidden">
                  {[
                    {
                      src: "/images/platforms/ps-mini.webp",
                      alt: "PlayStation",
                      width: 32,
                      height: 32,
                    },
                    {
                      src: "/images/platforms/xbox-mini.webp",
                      alt: "Xbox",
                      width: 32,
                      height: 32,
                    },
                    {
                      src: "/images/platforms/nintendo-mini.webp",
                      alt: "Nintendo Switch",
                      width: 32,
                      height: 32,
                    },
                    {
                      src: "/images/platforms/steam-mini.webp",
                      alt: "Steam",
                      width: 32,
                      height: 32,
                    },
                    {
                      src: "/images/platforms/epic.png",
                      alt: "Epic Games",
                      width: 32,
                      height: 32,
                    },
                  ].map((platform, index) => (
                    <div
                      key={index}
                      className="platform-item cursor-pointer h-8"
                    >
                      <Image
                        src={platform.src}
                        alt={platform.alt}
                        width={platform.width}
                        height={platform.height}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
