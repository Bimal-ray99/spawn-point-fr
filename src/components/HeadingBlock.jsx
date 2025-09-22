"use client";

import clsx from "clsx";
import Image from "next/image";

export default function HeadingBlock({
  text,
  bgColor = "bg-primary",
  textColor = "text-white",
  position = "left",
  className = "",
}) {
  const positionClass = position === "left" ? "left-10" : "right-10";

  return (
    <div
      className={clsx(
        "z-20 h-full w-[900px] overflow-hidden rounded-lg",
        bgColor,
        positionClass,
        className
      )}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
      }}
      aria-hidden="true"
    >
      <div className="bg-ele absolute h-full w-full bg-white opacity-10" />
      <Image
        src="/images/bg/halftone.jpg"
        alt=""
        fill
        className="object-cover opacity-10 mix-blend-multiply"
        aria-hidden="true"
      />
      <h2
        className={clsx(
          "relative z-20 px-6 py-2 pb-4 font-DurkBoldItalic tracking-tighter",
          "md:text-fluid-70 text-fluid-40 uppercase",
          textColor
        )}
      >
        {text}
      </h2>
    </div>
  );
}
