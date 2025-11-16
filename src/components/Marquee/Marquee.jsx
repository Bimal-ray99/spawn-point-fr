"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  useVelocity,
  useSpring,
} from "framer-motion";

/**
 * Industrial-Standard Infinite Marquee Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to scroll
 * @param {number} props.baseSpeed - Base scroll speed (negative for left, positive for right)
 * @param {string} props.className - Additional CSS classes for the wrapper
 * @param {string} props.contentClassName - CSS classes for the content container
 * @param {number} props.repeat - Number of times to repeat content (default: 4)
 * @param {boolean} props.pauseOnHover - Pause animation on hover (default: false)
 */
export default function Marquee({
  children,
  baseSpeed = -50,
  className = "",
  contentClassName = "",
  repeat = 2,
  pauseOnHover = false,
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const directionFactor = useRef(1);
  const isPaused = useRef(false);

  // Apply spring physics to scroll velocity for smooth transitions
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
    mass: 0.5,
  });

  // Transform velocity to speed multiplier
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Animation loop using RAF for smooth 60fps performance
  useAnimationFrame((_, delta) => {
    // Skip animation if paused
    if (isPaused.current) return;

    // Calculate base movement
    let moveBy = directionFactor.current * baseSpeed * (delta / 1000);

    // Update direction based on scroll
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Apply velocity influence
    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    // Update position
    baseX.set(baseX.get() + moveBy);
  });

  // Transform to pixel-based movement for seamless loop
  // Wraps at -50% to create infinite effect (content is duplicated)
  const x = useTransform(baseX, (latest) => {
    const wrapped = ((latest % 50) + 50) % 50;
    return `${-wrapped}%`;
  });

  const handleMouseEnter = () => {
    if (pauseOnHover) isPaused.current = true;
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) isPaused.current = false;
  };

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x }} className={`inline-flex ${contentClassName}`}>
        {/* Render content multiple times for infinite effect */}
        {Array.from({ length: repeat }).map((_, index) => (
          <div key={index} className="flex shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
