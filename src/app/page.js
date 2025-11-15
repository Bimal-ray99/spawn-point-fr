"use client";
import "./index.css";
import "./preloader.css";
import { useState, useEffect } from "react";

import { useLenis } from "lenis/react";

import CTAWindow from "@/components/CTAWindow/CTAWindow";
import PreLoader from "@/components/PreLoader/PreLoader";
import Hero from "@/components/Hero/Hero";
import WhatWeDo from "@/components/WhatWeDo/WhatWeDo";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection/FeaturedProjectsSection";
import ClientReviewsSection from "@/components/ClientReviewsSection/ClientReviewsSection";
import GalleryCallout from "@/components/GalleryCallout/GalleryCallout";

let isInitialLoad = true;

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    if (lenis) {
      if (loaderAnimating) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  useEffect(() => {
    if (showPreloader) {
      setLoaderAnimating(true);

      // Set timeout to match preloader animation duration
      const timer = setTimeout(() => {
        setLoaderAnimating(false);
      }, 200); // Adjust based on total animation time

      return () => clearTimeout(timer);
    }
  }, [showPreloader]);

  return (
    <>
      {showPreloader && <PreLoader />}
      <Hero showPreloader={showPreloader} />
      <WhatWeDo />
      <FeaturedProjectsSection />
      <ClientReviewsSection />
      <GalleryCallout />
      <CTAWindow
        img="/home/home-cta-window.jpg"
        header="Terrene"
        callout="Spaces that breathe with time"
        description="Our approach is guided by rhythm, proportion, and light, allowing every environment to grow more meaningful as it is lived in."
      />
    </>
  );
}
