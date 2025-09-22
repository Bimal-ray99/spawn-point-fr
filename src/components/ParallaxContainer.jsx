"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function ParallaxContainer({
  style,
  children,
  className,
  parallaxAmount,
}) {
  const imageContainer = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageContainer,
    offset: ["start end", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, (latest) => {
    if (typeof window === "undefined" || !imageContainer.current) return 0;

    return (
      latest *
      (window.innerHeight +
        imageContainer.current.getBoundingClientRect().height)
    );
  });

  const transform = useTransform(scrollY, (latest) => {
    if (typeof window === "undefined" || !imageContainer.current) {
      return "translateY(0%) scale(1)";
    }

    const containerHeight =
      imageContainer.current.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;

    if (containerHeight >= windowHeight) {
      return `translateY(${
        scrollYProgress.get() * parallaxAmount * 2 - parallaxAmount
      }%) scale(1)`;
    } else {
      const translateY =
        (parallaxAmount / (windowHeight - containerHeight)) *
        (latest - containerHeight);
      const scale = 1 + 0.01 * parallaxAmount;
      return `translateY(${translateY}%) scale(${scale})`;
    }
  });

  return (
    <motion.div className="overflow-hidden" ref={imageContainer}>
      <motion.div
        style={{
          transform,
          ...style,
        }}
        className={cn(className, "origin-bottom")}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
