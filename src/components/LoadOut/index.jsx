"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";

const packs = [
  {
    coins: "400",
    price: "₹199/-",
    popular: false,
  },
  {
    coins: "1200",
    price: "₹499/-",
    popular: true,
  },
  {
    coins: "2500",
    price: "₹999/-",
    popular: false,
  },
];

export default function LoadOut() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-background"
    >
      {/* Background Image - Low opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/elements/bg-1.png"
          alt=""
          fill
          className="object-cover opacity-20"
          aria-hidden="true"
        />
      </div>

      {/* Halftone Pattern Background */}
      <div className="absolute inset-0 z-[1] halftone-animated opacity-25" />

      <div className="absolute left-0 top-0 z-[1] pointer-events-none">
        <Image
          src="/home/mira.png"
          alt="Mira"
          width={900}
          height={1200}
          className="w-[35vw] h-auto object-contain object-top"
          priority
        />
      </div>
      <div className="absolute right-0 bottom-0 z-[1] pointer-events-none">
        <Image
          src="/coin.png"
          alt="Mira"
          width={900}
          height={900}
          className="w-[15vw] h-auto object-contain object-top"
          priority
        />
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          WebkitMaskImage: "url('/elements/center.svg')",
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
          maskImage: "url('/elements/center.svg')",
          maskSize: "cover",
          maskPosition: "center",
        }}
      >
        {/* Background Image */}
        <Image src="/img.webp" alt="" fill className="object-cover" />
        {/* Primary Color Overlay */}
        <div className="absolute inset-0 bg-primary/90" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-DurkItalic uppercase text-white leading-[0.85] mb-6 "
          >
            CHOOSE YOUR
            <br />
            LOAD OUT
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-black/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/10"
          >
            <p className="font-mono text-white tracking-widest uppercase text-xs font-bold">
              ADD LUCI COINS TO BOOK YOUR SLOT
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 px-4 md:px-12 max-w-6xl mx-auto">
          {packs.map((pack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Hard Shadow - Primary to Secondary on hover */}
              <div
                className="absolute inset-0 bg-black translate-y-3 translate-x-3 transition-all duration-300 group-hover:translate-y-4 group-hover:translate-x-4 group-hover:bg-black"
                style={{
                  WebkitMaskImage: "url('/mask-1920.svg')",
                  WebkitMaskSize: "cover",
                  maskImage: "url('/mask-1920.svg')",
                  maskSize: "cover",
                }}
              />

              {/* Card Content */}
              <div
                className="relative bg-white h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 border-2 border-transparent"
                style={{
                  WebkitMaskImage: "url('/mask-1920.svg')",
                  WebkitMaskSize: "cover",
                  maskImage: "url('/mask-1920.svg')",
                  maskSize: "cover",
                }}
              >
                {/* Halftone on Card */}
                <div className="absolute inset-0 z-[1] halftone-animated opacity-10 pointer-events-none" />

                {/* Popular Badge */}
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider z-20">
                    Popular
                  </div>
                )}

                <div className="absolute inset-0 z-0 pointer-events-none">
                  <Image
                    src="/elements/bg-1.png"
                    alt=""
                    fill
                    className="object-cover opacity-10"
                    aria-hidden="true"
                  />
                </div>

                {/* Top Section */}
                <div className="p-12 text-center flex-1 flex flex-col justify-center items-center relative z-10">
                  <h3 className="text-6xl font-black text-black mb-2 group-hover:text-secondary transition-colors">
                    {pack.coins}
                  </h3>
                  <span className="font-mono text-xs text-base-400 uppercase tracking-[0.2em] font-bold">
                    Coins
                  </span>
                </div>

                {/* Divider */}
                <div className="h-0.5 w-full bg-base-200 group-hover:bg-secondary transition-colors" />

                {/* Bottom Section */}
                <div className="p-6 text-center bg-gray-50 transition-colors relative z-10">
                  <span className="text-4xl font-black text-base-500 group-hover:text-secondary transition-colors">
                    {pack.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Hard Shadow */}
          <div className="absolute inset-0 bg-black/20 translate-y-4 translate-x-4 blur-sm" />

          <div className="relative bg-white p-16 text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />

            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-DurkItalic uppercase text-[#4361EE] mb-4 leading-[0.85]">
                OR JUST MINE IT!
              </h3>
              <p className="font-mono text-gray-500 uppercase tracking-wider text-sm font-bold mb-10">
                Complete challenges to earn free coins everyday
              </p>

              <AnimatedButton label="Start Mining" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
