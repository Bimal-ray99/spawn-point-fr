"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import clsx from "clsx";
import NavButton from "./NavButton";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";

const FeaturedTournamentCarousel = ({ featuredTournaments = [] }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSlideChange = useCallback(
    (swiper) => {
      const newIndex = swiper.realIndex;
      if (newIndex === activeIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(newIndex);
        setIsTransitioning(false);
      }, 600);
    },
    [activeIndex]
  );

  if (featuredTournaments.length === 0) return null;

  const nextSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const prevSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="relative z-[2] mb-12 h-[60vh] w-full md:h-full">
      <div className="relative h-[60vh] w-[100vw] overflow-hidden rounded-xl md:h-[640px]">
        {/* Swiper */}
        <Swiper
          ref={swiperRef}
          grabCursor={true}
          allowTouchMove={true}
          centeredSlides={true}
          draggable={true}
          slidesPerView={1.2}
          spaceBetween={30}
          speed={1200}
          loop={false}
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Autoplay, Pagination]}
          className="swiper-tournament-custom h-full w-full"
          onSlideChange={handleSlideChange}
        >
          {featuredTournaments.map((tournament) => (
            <SwiperSlide key={tournament.id} className="h-full">
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Background Image Masked */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    WebkitMaskImage: "url('/mask-1920.svg')",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "cover",
                    maskImage: "url('/mask-1920.svg')",
                    maskRepeat: "no-repeat",
                    maskSize: "cover",
                  }}
                >
                  <Image
                    src={tournament.imageSrc}
                    alt=""
                    fill
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/80 to-black"
                  style={{
                    WebkitMaskImage: "url('/mask-1920.svg')",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "cover",
                    maskImage: "url('/mask-1920.svg')",
                    maskRepeat: "no-repeat",
                    maskSize: "cover",
                  }}
                ></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Fixed Slide Content */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {featuredTournaments.map((tournament, index) => (
            <div
              key={`content-${tournament.id}`}
              className={clsx(
                "duration-600 absolute inset-0 transition-all",
                activeIndex === index && !isTransitioning
                  ? "scale-100 opacity-100"
                  : "scale-110 opacity-0"
              )}
              style={{
                transformOrigin: "center",
                transition: "all 0.8s ease",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
                <h1 className="font-DurkItalic text-[12vw] md:text-[8vw] font-extrabold uppercase leading-tight text-white shadow-md drop-shadow-lg">
                  {tournament.title}
                </h1>
                <p className="mb-8 mt-6 text-white/90 text-lg md:text-xl max-w-3xl">
                  {tournament.description}
                </p>
              </div>

              <div className="font-NeueMontreal absolute bottom-12 left-0 right-0 flex justify-center gap-8 text-center text-white sm:bottom-20">
                <div className="hidden flex-col md:flex">
                  <span className="text-xs text-gray-400">Genre:</span>
                  <span className="text-lg">{tournament.genre}</span>
                </div>

                <div className="hidden h-10 w-px bg-white md:block" />

                <div className="hidden flex-col md:flex">
                  <span className="text-xs text-gray-400">Platforms:</span>
                  <div className="mt-1 flex gap-2">
                    {tournament.platforms?.map((platform, i) => (
                      <span
                        key={i}
                        className="text-sm font-medium text-white/80"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-auto">
                  <AnimatedButton
                    route={`/tournament/${tournament.slug}/register`}
                    label="Register Now"
                    animate={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
      </div>
      <div className="pointer-events-none absolute left-0 top-[90%] z-30 hidden w-full justify-center gap-12 px-2 sm:px-6 md:top-1/2 md:flex md:-translate-y-1/2 md:justify-between md:gap-0">
        <div className="pointer-events-auto">
          <NavButton
            isNext={true}
            onClick={prevSlide}
            disabled={activeIndex === 0}
          />
        </div>

        <div className="pointer-events-auto">
          <NavButton
            isNext={false}
            onClick={nextSlide}
            disabled={activeIndex === featuredTournaments.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedTournamentCarousel;
