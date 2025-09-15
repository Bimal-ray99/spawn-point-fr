"use client";
import { useEffect } from "react";

const PreLoader = () => {
  useEffect(() => {
    // Add the animate class to trigger CSS animations
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.classList.add("animate");
    }
  }, []);

  return (
    <div className="preloader bg-primary text-white fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden italic">
      <div className="marquee-wrapper rotate-[8deg] w-[150%] -ml-[45%]">
        <div className="marquee marquee-1 whitespace-nowrap uppercase px-8 leading-none text-[15rem]">
          Spawn Point Spawn Point Spawn Point Spawn Point
        </div>
      </div>
      <div className="marquee-wrapper rotate-[8deg] w-[150%] -ml-[35%]">
        <div className="marquee marquee-2 whitespace-nowrap uppercase px-8 leading-none text-[15rem]">
          Spawn Point Spawn Point Spawn Point Spawn Point
        </div>
      </div>
      <div className="marquee-wrapper rotate-[8deg] w-[150%] -ml-[5%]">
        <div className="marquee marquee-3 whitespace-nowrap uppercase px-8 leading-none text-[15rem]">
          Spawn Point Spawn Point Spawn Point Spawn Point
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
