import { useRef } from "react";
import { useScrollGsap } from "@/hooks/useScrollGsap";

export function ScrollingText({
  text,
  className,
  direction = "leftToRight",
  scrollTrigger,
  scrubSpeed = 1,
  style,
}) {
  const textRef = useRef(null);

  useScrollGsap({
    elementRef: textRef,
    triggerRef: scrollTrigger,
    from: { x: direction === "leftToRight" ? "-30vw" : "30vw" },
    to: { x: direction === "leftToRight" ? "30vw" : "-30vw" },
    scrub: scrubSpeed,
  });

  return (
    <span ref={textRef} className={className} style={style} aria-hidden="true">
      {text}
    </span>
  );
}
