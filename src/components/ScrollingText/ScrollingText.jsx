"use client";
import { useRef } from "react";
import { useScrollGsap } from "@/hooks/useScrollGsap";

export const ScrollingText = ({
  text,
  className,
  direction = "leftToRight",
  scrollTrigger,
  scrubSpeed = 1,
}) => {
  const textRef = useRef(null);

  useScrollGsap({
    elementRef: textRef,
    triggerRef: scrollTrigger,
    from: { x: direction === "leftToRight" ? "-30vw" : "30vw" },
    to: { x: direction === "leftToRight" ? "30vw" : "-30vw" },
    scrub: scrubSpeed,
  });

  return (
    <span ref={textRef} className={className} aria-hidden="true">
      {text}
    </span>
  );
};
