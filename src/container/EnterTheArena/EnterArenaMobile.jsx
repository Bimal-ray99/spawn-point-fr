"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Character from "../../../public/images/hero/mira.png";
import WellnessSanctuaryImage from "../../../public/images/hero/hero-bg-shrapnel.webp";
import MaskedHeading from "@/components/common/MaskedHeading";
import { ScrollingText } from "@/animation/ScrollingText";
import HeadingBlock from "@/components/HeadingBlock";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useScrollGsap } from "@/hooks/useScrollGsap";

export default function EnterArenaMobile() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useScrollGsap({
    elementRef: imageRef,
    from: { y: "5vw" },
    to: { y: "-8vw" },
  });

  return (
    <div
      className="relative flex min-h-screen flex-col-reverse overflow-hidden bg-white text-offblack"
      ref={sectionRef}
    >
      <div className="relative bottom-12 z-40 ml-4">
        <div className="">
          <div>
            <h2 className="text-fluid-40 px-6 font-DurkBoldItalic uppercase text-primary">
              Enter the
            </h2>
          </div>

          <div>
            <HeadingBlock
              text="ARENA"
              bgColor="bg-primary"
              textColor="text-white"
              position="left"
            />
          </div>
          <div className="mx-4 mt-6 z-40">
            <p
              className={clsx(
                "text-offblack paragraph",
                "font-medium leading-relaxed"
              )}
            >
              Dominate the battlefield, outplay your rivals, and claim your
              legacy.{" "}
              <span className="rounded-sm bg-primary px-2 font-extrabold uppercase text-white shadow-md backdrop-blur">
                The Arena awaits!
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -left-32 top-[12rem] z-0 flex items-end">
        <ScrollingText
          text="EnterThe"
          direction="leftToRight"
          className={clsx(
            "absolute font-DurkItalic uppercase tracking-wider text-primary",
            "pointer-events-none leading-none",
            "right-40 top-[-2rem] z-10",
            "text-fluid-300"
          )}
          scrollTrigger={sectionRef}
          aria-hidden="true"
        />
      </div>

      <div
        ref={imageRef}
        className={clsx(
          "absolute top-20 z-30 flex items-center justify-center",
          ""
        )}
        aria-hidden="true"
      >
        <Image
          src={Character}
          alt=""
          width={550}
          height={550}
          className="object-cover"
          priority
          aria-hidden="true"
        />
      </div>

      <div
        className={clsx("absolute right-0 top-0 z-10 w-[65%] bg-primary")}
        style={{
          clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute z-30 flex items-end">
          <ScrollingText
            text="EnterThe"
            direction="rightToLeft"
            className={clsx(
              "absolute font-DurkItalic uppercase tracking-wider text-white",
              "pointer-events-none leading-none",
              "left-20 top-[-6rem] z-10",
              "text-fluid-400"
            )}
            scrollTrigger={sectionRef}
            aria-hidden="true"
          />
        </div>
        <div className="halftone-overlay opacity-30" />
        <Image
          src={WellnessSanctuaryImage}
          alt="wellness-sanctuary-image"
          className="min-h-screen w-full object-cover opacity-20"
        />
      </div>

      <div className="absolute top-0">
        <MaskedHeading text="Spawn" className="-left-28" />
      </div>

      {/* Additional UI Elements */}
      <div
        className="absolute left-[50px] top-10 z-0 flex items-center"
        aria-label="Timer display"
      >
        <div className="h-3.5 w-3.5 bg-primary" />
        <div className="px-2 text-sm font-bold tracking-widest text-primary">
          00:19:00
        </div>
      </div>

      {/* Gradient overlay for mobile */}
      <div
        className="absolute bottom-0 z-30 block h-[65%] w-full bg-gradient-to-t from-white via-white to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
