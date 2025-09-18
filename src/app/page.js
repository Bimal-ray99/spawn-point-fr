"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import PreLoader from "@/components/PreLoader/PreLoader";
import HeroDesktop from "@/components/screens/homepage/HeroDesktop";

let hasInitialLoaded = false;

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasInitialLoaded) {
      setIsLoading(true);

      const loadingTimer = setTimeout(() => {
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
        setIsLoading(false);
        hasInitialLoaded = true;
      }, 5000);

      return () => clearTimeout(loadingTimer);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <PreLoader key="preloader" />}
      </AnimatePresence>
      <HeroDesktop />
    </>
  );
}
