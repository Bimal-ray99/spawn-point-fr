"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { logoData } from "./logoData";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = () => {
  const scrollTriggerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const overlay = document.querySelector("[data-overlay]");
    if (!overlay) return;

    // Initialize overlay positioning
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.transform = "none";

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Get DOM elements using data attributes
    const heroSection = document.querySelector("[data-hero]");
    const heroImgContainer = document.querySelector(
      "[data-hero-img-container]"
    );
    const heroImgLogo = document.querySelector("[data-hero-logo]");
    const heroImgCopy = document.querySelector("[data-hero-copy]");
    const fadeOverlay = document.querySelector("[data-fade-overlay]");
    const svgOverlay = document.querySelector("[data-overlay]");
    const overlayCopy = document.querySelector("[data-overlay-copy]");

    const initialOverlayScale = 500;
    const logoContainer = document.querySelector("[data-logo-container]");
    const logoMask = document.getElementById("logoMask");

    if (!logoMask) return;

    logoMask.setAttribute("d", logoData);

    // Update logo mask to fit container
    function updateLogoMask() {
      if (!logoContainer || !logoMask) return;

      const logoDimensions = logoContainer.getBoundingClientRect();
      const logoBoundingBox = logoMask.getBBox();

      const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
      const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
      const logoScaleFactor = Math.min(
        horizontalScaleRatio,
        verticalScaleRatio
      );

      const logoHorizontalPosition =
        logoDimensions.left +
        (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
        logoBoundingBox.x * logoScaleFactor;
      const logoVerticalPosition =
        logoDimensions.top +
        (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
        logoBoundingBox.y * logoScaleFactor;

      logoMask.setAttribute(
        "transform",
        `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`
      );
    }

    updateLogoMask();

    // Set initial SVG overlay state
    gsap.set(svgOverlay, {
      transformOrigin: "50% 50%",
      xPercent: 0,
      yPercent: 0,
      left: 0,
      top: 0,
      scale: initialOverlayScale,
    });

    // Setup ScrollTrigger animation
    function setupScrollTrigger() {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: "[data-hero]",
        start: "top top",
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress;

          // Phase 1: Fade out logo and copy text (0% - 15%)
          if (scrollProgress <= 0.15) {
            const fadeOpacity = 1 - scrollProgress * (1 / 0.15);
            gsap.set([heroImgLogo, heroImgCopy], {
              opacity: fadeOpacity,
            });
          } else {
            gsap.set([heroImgLogo, heroImgCopy], {
              opacity: 0,
            });
          }

          // Phase 2: Scale hero image and shrink overlay (0% - 85%)
          if (scrollProgress <= 0.85) {
            const normalizedProgress = scrollProgress * (1 / 0.85);
            const heroImgContainerScale = 1 + 0.3 * normalizedProgress;
            const overlayScale =
              initialOverlayScale *
              Math.pow(1 / initialOverlayScale, normalizedProgress);

            gsap.set(heroImgContainer, {
              scale: heroImgContainerScale,
              transformOrigin: "center center",
            });

            gsap.set(svgOverlay, {
              transformOrigin: "50% 25%",
              scale: overlayScale,
              force3D: true,
            });

            // Fade in white overlay (25% - 65%)
            let fadeOverlayOpacity = 0;
            if (scrollProgress >= 0.25) {
              fadeOverlayOpacity = Math.min(
                1,
                (scrollProgress - 0.25) * (1 / 0.4)
              );
            }

            gsap.set(fadeOverlay, {
              opacity: fadeOverlayOpacity,
            });
          }

          // Phase 3: Reveal overlay copy text (70% - 85%)
          if (scrollProgress >= 0.7 && scrollProgress <= 0.85) {
            const overlayCopyRevealProgress =
              (scrollProgress - 0.7) * (1 / 0.15);

            const gradientSpread = 100;
            const gradientBottomPosition =
              240 - overlayCopyRevealProgress * 280;
            const gradientTopPosition = gradientBottomPosition - gradientSpread;
            const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;

            if (overlayCopy) {
              overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`;
              overlayCopy.style.backgroundClip = "text";
              overlayCopy.style.webkitBackgroundClip = "text";

              gsap.set(overlayCopy, {
                scale: overlayCopyScale,
                opacity: overlayCopyRevealProgress,
              });
            }
          } else if (scrollProgress < 0.7 && overlayCopy) {
            gsap.set(overlayCopy, {
              opacity: 0,
            });
          }
        },
      });
    }

    setupScrollTrigger();

    // Handle window resize
    const handleResize = () => {
      updateLogoMask();
      ScrollTrigger.refresh();
      setupScrollTrigger();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove((time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time * 1000);
        }
      });
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        data-hero
        className="relative w-screen h-screen bg-[#111117] text-center overflow-hidden"
      >
        {/* Hero Image Container */}
        <div
          data-hero-img-container
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] rounded-xl"
        >
          {/* Background Image Layer */}
          <img
            src="/home/hero-img-layer-1.png"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {/* Logo */}
          <div
            data-hero-logo
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-auto will-change-[opacity]"
          >
            <img
              src="/home/tru.png"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Foreground Image Layer */}
          <img
            src="/home/hero-img-layer-2.png"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {/* Scroll Copy */}
          <div
            data-hero-copy
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 will-change-[opacity]"
          >
            <p className="text-white font-bold uppercase text-[0.65rem] leading-[0.8] tracking-wide">
              Scroll down to reveal
            </p>
          </div>
        </div>

        {/* White Fade Overlay */}
        <div
          data-fade-overlay
          className="absolute top-0 left-0 w-full h-full bg-white opacity-0 will-change-[opacity]"
        ></div>

        {/* SVG Mask Overlay */}
        <div
          data-overlay
          className="fixed top-0 left-0 w-screen h-[150vh] z-[1] origin-center"
        >
          <svg width="100%" height="100%">
            <defs>
              <mask id="logoRevealMask">
                <rect width="100%" height="100%" fill="white" />
                <path id="logoMask"></path>
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#111117"
              mask="url(#logoRevealMask)"
            />
          </svg>
        </div>

        {/* Logo Container (invisible, used for mask positioning) */}
        <div
          data-logo-container
          className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center w-[400px] h-[400px] z-[2]"
        ></div>

        {/* Overlay Copy Text */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-[2] w-full px-4">
          <h1
            data-overlay-copy
            className="uppercase text-4xl md:text-6xl lg:text-8xl xl:text-[6rem] font-DurkBold tracking-tight md:tracking-tighter lg:tracking-[-0.2rem] leading-[0.8] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-transparent origin-top opacity-0"
          >
            Experience the Future
          </h1>
        </div>
      </section>
    </>
  );
};

export default ScrollReveal;
