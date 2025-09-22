"use client";

import Image from "next/image";
import { useRef } from "react";
import Character from "../../../public/images/hero/mira.png";
import MaskedHeading from "@/components/common/MaskedHeading";
import ResponsiveImage from "@/components/ResponsiveImage";
import { ScrollingText } from "@/animation/ScrollingText";
import HeadingBlock from "@/components/HeadingBlock";
import clsx from "clsx";
import { Bgelement1 } from "@/components/Bgelement1";
import { useScrollGsap } from "@/hooks/useScrollGsap";

export default function EnterArena() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useScrollGsap({
    elementRef: imageRef,
    from: { x: "-1vw" },
    to: { x: "1vw" },
  });

  return (
    <div
      ref={sectionRef}
      className="relative grid min-h-screen grid-cols-2 overflow-hidden bg-white text-offblack "
    >
      {/* Text Side */}
      <div className="flex flex-col justify-center padding-y md:py-0">
        <div className="ml-20 flex w-fit flex-col gap-6">
          <h2 className="text-fluid-70 px-6 font-DurkBoldItalic uppercase text-primary">
            Enter the
          </h2>

          <HeadingBlock
            text="ARENA"
            bgColor="bg-primary"
            textColor="text-white"
            position="left"
          />

          <p className="paragraph mx-0 mt-6 max-w-md pl-10 font-bold leading-relaxed tracking-wider text-offblack">
            Dominate the battlefield, outplay your rivals, and claim your
            legacy.{" "}
            <span className="rounded-sm bg-primary px-2 font-extrabold uppercase text-white shadow-md backdrop-blur">
              The Arena awaits!
            </span>
          </p>
        </div>
      </div>

      {/* Left Scrolling Text */}
      <div className="absolute inset-0 bottom-[-10rem] z-0 flex items-end">
        <ScrollingText
          text="EnterThe"
          direction="leftToRight"
          className={clsx(
            "absolute font-DurkItalic uppercase tracking-wider text-transparent",
            "stroke-text pointer-events-none z-0 leading-none",
            "text-fluid-400 bottom-[-6rem] right-80"
          )}
          scrollTrigger={sectionRef}
        />
      </div>

      {/* Character Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-30 ml-[350px] mt-[400px] flex items-center justify-center"
        aria-hidden="true"
      >
        <Image
          src={Character}
          alt="Arena Character"
          width={550}
          height={550}
          className="object-contain"
          priority
        />
      </div>

      {/* Right Background Video Section */}
      <div
        className="absolute right-0 top-0 z-10 w-[45%] bg-primary"
        style={{
          clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        <ScrollingText
          text="EnterThe"
          direction="rightToLeft"
          className={clsx(
            "absolute font-DurkItalic uppercase tracking-wider text-white",
            "pointer-events-none leading-none text-fluid-400",
            "top-[-14rem] -left-44 z-20"
          )}
          scrollTrigger={sectionRef}
        />

        <ResponsiveImage parallaxAmount={40}>
          <div className="halftone-overlay opacity-[3%]" />
          <video
            className="min-h-screen w-full object-cover opacity-30"
            poster="/images/bg/main-home-rev-3.png"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/rainbow.mp4" type="video/mp4" />
          </video>
        </ResponsiveImage>
      </div>

      <MaskedHeading text="Spawn" className="" />

      {/* UI Elements */}
      <div className="ui-element absolute bottom-[50px] right-[45px] z-40 h-3.5 w-3.5 bg-primary" />
      <div className="absolute bottom-[180px] left-[50px] z-0 h-3.5 w-3.5 bg-primary" />

      {/* Timer */}
      <div className="absolute left-[50px] top-10 z-0 flex items-center">
        <div className="h-3.5 w-3.5 bg-primary" />
        <div className="px-2 text-sm font-bold tracking-widest text-primary">
          00:19:00
        </div>
      </div>

      <Bgelement1
        className="absolute -top-20 right-[30%] z-0 -rotate-90"
        textColor="text-primary"
        lineColor="bg-primary"
        text="#GamingLeague"
      />

      <div className="mask-left-corner corner-mask-fallback absolute bottom-0 right-0 z-10 h-1/2 w-[30%] rotate-180 bg-gray-200" />
    </div>
  );
}
