"use client";
import "./index.css";
import "./preloader.css";
import { useState, useEffect } from "react";

import { useLenis } from "lenis/react";

import CTAWindow from "@/components/CTAWindow/CTAWindow";
import PreLoader from "@/components/PreLoader/PreLoader";
import Hero from "@/components/Hero/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import ChampionSection from "@/components/ChampionSection";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection/FeaturedProjectsSection";
import ClientReviewsSection from "@/components/ClientReviewsSection/ClientReviewsSection";
import GalleryCallout from "@/components/GalleryCallout/GalleryCallout";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import Nav from "@/components/Nav/Nav";
import FeaturesSection from "@/components/FeaturesSection";
import ParallaxSection from "@/components/ParallaxSection/ParallaxSection";
import Vrcard from "@/components/HorizontalScroll/HorizontalScroll";
import { RefreshSection } from "@/components/RefreshSection/RefreshSection";
import Challenges from "@/components/Challenges";
import HowToClaim from "@/components/HowToClaim";
import GameModes from "@/components/GameModes";
import LoadOut from "@/components/LoadOut";
import BuiltDifferent from "@/components/BuiltDifferent";
import Tournament from "@/components/Tournament";

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
      <Nav />
      {showPreloader && <PreLoader />}
      <Hero showPreloader={showPreloader} />
      <WhatWeDo />
      <Tournament />
      {/* <BuiltDifferent /> */}
      {/* <FeaturesSection /> */}
      <ParallaxSection />
      <Vrcard />
      <GameModes />
      <ChampionSection />
      <LoadOut />
      <Challenges />
      <HowToClaim />
      <RefreshSection />
      {/* <ClientReviewsSection />
      <GalleryCallout />
      <CTAWindow
        img="/home/home-cta-window.jpg"
        header="Terrene"
        callout="Spaces that breathe with time"
        description="Our approach is guided by rhythm, proportion, and light, allowing every environment to grow more meaningful as it is lived in."
      /> */}
    </>
  );
}
