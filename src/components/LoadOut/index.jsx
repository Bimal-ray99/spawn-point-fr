"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
      className="relative py-32 overflow-hidden bg-[#4361EE]"
    >
      {/* Halftone Pattern Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-DurkItalic uppercase text-white leading-[0.85] mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]"
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
              {/* Hard Shadow */}
              <div className="absolute inset-0 bg-black translate-y-3 translate-x-3 transition-transform duration-200 group-hover:translate-y-4 group-hover:translate-x-4" />

              {/* Card Content */}
              <div className="relative bg-white border-2 border-black h-full flex flex-col transition-transform duration-200 group-hover:-translate-y-1 group-hover:-translate-x-1">
                {/* Popular Badge */}
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider z-20">
                    Popular
                  </div>
                )}

                {/* Top Section */}
                <div className="p-12 text-center flex-1 flex flex-col justify-center items-center">
                  <h3 className="text-6xl font-black text-[#4361EE] mb-2">
                    {pack.coins}
                  </h3>
                  <span className="font-mono text-xs text-black uppercase tracking-[0.2em] font-bold">
                    Coins
                  </span>
                </div>

                {/* Divider */}
                <div className="h-0.5 w-full bg-black" />

                {/* Bottom Section */}
                <div className="p-6 text-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <span className="text-4xl font-black text-black/80">
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

              <button className="group relative inline-block">
                <div className="absolute inset-0 bg-black translate-y-2 translate-x-2 transition-transform duration-200 group-hover:translate-y-3 group-hover:translate-x-3" />
                <div className="relative bg-[#4361EE] border-2 border-black px-12 py-4 text-white font-black uppercase tracking-wider hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200">
                  Start Mining
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
