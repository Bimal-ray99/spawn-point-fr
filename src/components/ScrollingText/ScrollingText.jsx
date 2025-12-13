"use client";
import { useRef } from "react";
import { useScrollGsap } from "@/hooks/useScrollGsap";

export const ScrollingText = ({
  text,
  className,
  direction = "leftToRight",
  scrollTrigger,
  scrubSpeed = 1,
  startX = null, // Custom start position (e.g., "50%" or "30vw")
  endX = null, // Custom end position (e.g., "-50%" or "-30vw")
}) => {
  const textRef = useRef(null);

  // Default positions based on direction
  const defaultFrom = direction === "leftToRight" ? "-30vw" : "30vw";
  const defaultTo = direction === "leftToRight" ? "30vw" : "-30vw";

  useScrollGsap({
    elementRef: textRef,
    triggerRef: scrollTrigger,
    from: { x: startX !== null ? startX : defaultFrom },
    to: { x: endX !== null ? endX : defaultTo },
    scrub: scrubSpeed,
  });

  return (
    <span ref={textRef} className={className} aria-hidden="true">
      {text}
    </span>
  );
};
