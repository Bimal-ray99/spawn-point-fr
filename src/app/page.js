"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import gsap from "gsap";

export default function Hero() {
  useEffect(() => {
    gsap.fromTo(
      ".title",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <section className="h-screen flex flex-col justify-center items-center text-red-500">
      <motion.h1
        className="title text-5xl font-bold uppercase"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        index
      </motion.h1>
      <a className="text-[4rem]">adasdasdasdadasdasdasdawdsadsad</a>
    </section>
  );
}
