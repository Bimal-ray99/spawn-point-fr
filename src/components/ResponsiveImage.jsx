"use client";

import { useIsMobile } from "@/utils/IsMobile";
import ParallaxContainer from "@/components/ParallaxContainer";

export default function ResponsiveImage({ children, parallaxAmount }) {
  const isMobile = useIsMobile();

  return isMobile ? (
    children
  ) : (
    <ParallaxContainer parallaxAmount={parallaxAmount}>
      {children}
    </ParallaxContainer>
  );
}
