"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export const StaggerChildren = ({
  children,
  staggerDelay = 0.1,
  threshold = 0.1,
  className = "",
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

// ScrollTrigger - Component that applies various animations when scrolled into view
export const ScrollTrigger = ({
  children,
  threshold = 0.2,
  triggerOnce = true,
  animationType = "fadeIn", // Options: fadeIn, slideUp, slideIn, scaleUp, etc.
  delay = 0,
  duration = 0.6,
  staggerChildren = 0.1, // For staggered animations of children
  className = "",
  viewportMargin = "0px 0px -100px 0px",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
    margin: viewportMargin,
  });

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Define animation variants
  const animationVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut",
        },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut",
        },
      },
    },
    slideIn: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut",
        },
      },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut",
        },
      },
    },
    staggerChildren: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerChildren,
          delayChildren: delay,
        },
      },
    },
    childAnimation: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    },
  };

  // Select the appropriate animation variant
  const selectedVariant =
    animationVariants[animationType] || animationVariants.fadeIn;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariant}
    >
      {children}
    </motion.div>
  );
};

// For use with StaggerChildren or ScrollTrigger with staggerChildren animation
export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
