"use client";

import clsx from "clsx";

export function Bgelement1({
  text,
  textColor = "text-secondary",
  lineColor = "bg-secondary",
  position = "left",
  className,
}) {
  const positionClass =
    position === "left" ? "left-4 md:left-[30px]" : "right-4 md:right-[30px]";

  return (
    <div
      className={clsx(
        "absolute z-40 flex flex-col items-center",
        positionClass,
        className
      )}
      aria-hidden="true"
    >
      <div className={clsx("h-3.5 w-3.5", lineColor)} />
      <div className={clsx("h-40 w-0.5", lineColor)} />
      <div
        className={clsx(
          "mt-20 rotate-90 text-[10px] font-bold tracking-widest uppercase",
          textColor
        )}
      >
        {text}
      </div>
    </div>
  );
}
