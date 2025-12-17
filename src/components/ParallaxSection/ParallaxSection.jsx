"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ParallaxSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection() {
  const parallaxLayersRef = useRef(null);

  useEffect(() => {
    if (!parallaxLayersRef.current) return;

    const triggerElement = parallaxLayersRef.current;

    // Create parallax timeline - exactly like Osmo
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0,
      },
    });

    // Define layers with their parallax speeds - exactly like Osmo
    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 },
    ];

    // Animate each layer
    layers.forEach((layerObj, idx) => {
      const layerElements = triggerElement.querySelectorAll(
        `[data-parallax-layer="${layerObj.layer}"]`
      );

      tl.to(
        layerElements,
        {
          yPercent: layerObj.yPercent,
          ease: "none",
        },
        idx === 0 ? undefined : "<"
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="parallax">
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>

          <div
            ref={parallaxLayersRef}
            data-parallax-layers
            className="parallax__layers"
          >
            {/* Layer 1 - Furthest back */}
            <img
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
              loading="eager"
              width="800"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img"
            />

            {/* Layer 2 - Mid back */}
            <img
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
              loading="eager"
              width="800"
              data-parallax-layer="2"
              alt=""
              className="parallax__layer-img"
            />

            {/* Layer 3 - Title */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h2 className="parallax__title font-DurkItalic text-[11vw] md:text-[10vw] lg:text-[9vw] font-bold leading-4 text-white uppercase tracking-normal">
                Designed for Immersion
              </h2>
            </div>

            {/* Layer 4 - Front */}
            <img
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
              loading="eager"
              width="800"
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img"
            />
          </div>

          {/* Fade gradient at bottom */}
          <div className="parallax__fade"></div>
        </div>
      </section>

      {/* Content section below parallax */}
      <section className="parallax__content">
        <p className="text-white text-center font-medium text-lg md:text-xl lg:text-2xl max-w-4xl px-4 leading-relaxed tracking-wide">
          EXPERIENCE THE FUTURE OF GAMING WITH NEXT-GEN VR
        </p>
      </section>
    </div>
  );
}
