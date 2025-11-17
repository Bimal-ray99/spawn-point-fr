"use client";

import React, { useState } from "react";
import clsx from "clsx";

const cardData = [
  {
    id: 1,
    title: "TOURNAMENTS",
    subtitle: "Vr gaming",
    type: "keyholes",
    bgColor: "#FF69B4",
    hoverBgColor: "#FF1493",
    bgImage:
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67e0e2b1f6e5dcdd9b6c8e19_1.png",
    details: [
      "Visual identity",
      "Creative direction",
      "Style matching",
      "Asset direction (photo, video, 3D)",
      "Concept refinement",
    ],
    decorativeImages: [
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67dff0cd647cc1c2a0fa12b0_42.avif",
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67dff0cb495059a21b79d822_41.avif",
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67dff0cb6e7ca5acbd5b26d1_47.avif",
    ],
    hoverImage: "/crd1.png",
  },
  {
    id: 2,
    title: "ARCADE",
    subtitle: "IB cricket",
    type: "mockups",
    bgColor: "#A8B5A0",
    hoverBgColor: "#8A9B82",
    bgImage:
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67e0e2b221e5dd560faa83d8_2.png",
    details: [
      "Full website design",
      "App Design",
      "Visual storytelling",
      "Bold visuals",
      "Wireframes & user flows",
    ],
    slideImages: [
      {
        src: "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67dff0cb76b1b2b8ec9e8fe6_8.avif",
        direction: "left",
      },
      {
        src: "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67dff0cb76b1b2b8ec9e8fe6_8.avif",
        direction: "right",
      },
    ],
    hoverImage: "/crd1.png",
  },
  {
    id: 3,
    title: "VR ZONE",
    subtitle: "Ar gaming",
    type: "code",
    bgColor: "#4A4458",
    hoverBgColor: "#2C2532",
    bgImage:
      "https://cdn.prod.website-files.com/67a72d4537cb6f129b978175/67e0e2b288c18ced0c07ffc3_3.png",
    details: ["Webflow", "GSAP", "Three.js / WebGL", "Shopify", "AND MORE"],
    hoverImage: "/crd1.png",
  },
];

export default function HorizontalScroll() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section id="services" className="w-full bg-black">
      <div className="w-full flex flex-col md:flex-row">
        {cardData.map((card) => (
          <div
            key={card.id}
            id={`service${card.id}`}
            className="relative flex-1 h-screen cursor-pointer overflow-hidden group"
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor:
                hoveredCard === card.id ? card.hoverBgColor : card.bgColor,
              transition: "background-color 700ms ease-out",
            }}
          >
            {/* crd1.png Image - Always visible, ABOVE decorative elements */}
            <div className="absolute inset-0 z-20">
              <img
                src="/home/crd1.png"
                alt=""
                className="w-full h-full object-[10%_center]"
              />
            </div>

            {/* Dark overlay on OTHER cards when THIS card is NOT hovered - ABOVE EVERYTHING */}
            <div
              className={clsx(
                "absolute inset-0 bg-black/60 z-40 transition-opacity duration-700",
                hoveredCard !== null && hoveredCard !== card.id
                  ? "opacity-100"
                  : "opacity-0"
              )}
            />

            {/* Background Image - Always visible */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${card.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Keyholes Container - BELOW crd1 image */}
            {card.type === "keyholes" && (
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-center z-5 transition-opacity duration-700",
                  hoveredCard === card.id ? "opacity-100" : "opacity-0"
                )}
              >
                {card.decorativeImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    loading="lazy"
                    alt=""
                    className="absolute object-contain keyhole transition-all duration-700"
                    style={{
                      width:
                        index === 0 ? "300px" : index === 1 ? "280px" : "320px",
                      height:
                        index === 0 ? "300px" : index === 1 ? "280px" : "320px",
                      top: index === 0 ? "20%" : index === 1 ? "25%" : "auto",
                      bottom: index === 2 ? "20%" : "auto",
                      left: index === 0 ? "15%" : index === 2 ? "auto" : "auto",
                      right: index === 1 ? "20%" : index === 2 ? "35%" : "auto",
                      transform:
                        hoveredCard === card.id
                          ? "translate3d(0px, 0px, 0px) scale3d(0.7, 0.7, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"
                          : "translate3d(0px, 0px, 0px) scale3d(0, 0, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                      transformStyle: "preserve-3d",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Mockup Images - Card 2 - Diagonal parallel lines layout - BELOW crd1 image */}
            {card.type === "mockups" && card.slideImages && (
              <div
                className={clsx(
                  "absolute inset-0 z-5 transition-opacity duration-700",
                  hoveredCard === card.id ? "opacity-100" : "opacity-0"
                )}
              >
                {/* First diagonal image - top left to bottom right */}
                <div
                  className="absolute transition-all duration-700"
                  style={{
                    top: "10%",
                    left: hoveredCard === card.id ? "10%" : "-50%",
                    width: "45%",
                    height: "80%",
                    transform: "rotate(-25deg)",
                    opacity: hoveredCard === card.id ? 1 : 0,
                    transitionDelay: "0ms",
                  }}
                >
                  <img
                    src={card.slideImages[0].src}
                    alt=""
                    className="w-full h-full object-cover shadow-2xl"
                  />
                </div>

                {/* Second diagonal image - parallel to first */}
                <div
                  className="absolute transition-all duration-700"
                  style={{
                    top: "10%",
                    right: hoveredCard === card.id ? "10%" : "-50%",
                    width: "45%",
                    height: "80%",
                    transform: "rotate(-25deg)",
                    opacity: hoveredCard === card.id ? 1 : 0,
                    transitionDelay: "150ms",
                  }}
                >
                  <img
                    src={card.slideImages[1].src}
                    alt=""
                    className="w-full h-full object-cover shadow-2xl"
                  />
                </div>
              </div>
            )}

            {/* Code Container - BELOW crd1 image */}
            {card.type === "code" && (
              <div
                className={clsx(
                  "absolute inset-0 overflow-hidden z-5 transition-opacity duration-700",
                  hoveredCard === card.id ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="w-full h-full p-4 font-mono text-xs leading-relaxed">
                  {Array.from({ length: 55 }).map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "decorative-text-code whitespace-nowrap",
                        i % 5 === 0
                          ? "opacity-30 text-green-400"
                          : "opacity-20 text-green-300",
                        i % 2 === 0 ? "text-left" : "text-right"
                      )}
                    >
                      011 1000 100 001 0010 0011011 1000 100 001 0010 0011011
                      1000 100 001 0010 0011
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Title - CENTERED - Always visible - HIGHEST z-index */}
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-DurkBold text-white uppercase leading-tight text-center px-4">
                {card.subtitle}
              </h2>
            </div>

            {/* Services Details Wrapper */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-8 md:p-12">
              <div className="services-details-container">
                <div className="space-y-3">
                  {card.details.map((detail, index) => (
                    <div
                      key={index}
                      className="div-hide xtra-margin overflow-hidden"
                    >
                      <div
                        className={clsx(
                          "par-sm white text-white text-base md:text-lg transition-all duration-700",
                          hoveredCard === card.id ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          transform:
                            hoveredCard === card.id
                              ? "translate3d(0px, 0em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"
                              : "translate3d(0px, 1em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        {detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
