"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Copy from "@/components/Copy/Copy";

gsap.registerPlugin(ScrollTrigger);

export default function WhatWeDo() {
  const tagsRef = useRef(null);

  useGSAP(
    () => {
      if (!tagsRef.current) return;

      const tags = tagsRef.current.querySelectorAll(".what-we-do-tag");
      gsap.set(tags, { opacity: 0, x: -40 });

      ScrollTrigger.create({
        trigger: tagsRef.current,
        start: "top 90%",
        once: true,
        animation: gsap.to(tags, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }),
      });
    },
    { scope: tagsRef }
  );

  return (
    <section className="what-we-do">
      <div className="container">
        <div className="what-we-do-header">
          <Copy delay={0.1}>
            <h1>
              <span className="spacer">&nbsp;</span>
              At Terrene, we design with purpose and clarity, creating spaces
              that speak through light, scale, and the quiet confidence of
              lasting form.
            </h1>
          </Copy>
        </div>
        <div className="what-we-do-content">
          <div className="what-we-do-col">
            <Copy delay={0.1}>
              <p>How we work</p>
            </Copy>

            <Copy delay={0.15}>
              <p className="lg">
                We approach each build with a clarity of intent. Every plan is
                shaped through research, iteration, and conversation. What
                remains is the essential, designed to last and built to feel
                lived in.
              </p>
            </Copy>
          </div>
          <div className="what-we-do-col">
            <div className="what-we-do-tags" ref={tagsRef}>
              <div className="what-we-do-tag">
                <h3>Quiet</h3>
              </div>
              <div className="what-we-do-tag">
                <h3>View</h3>
              </div>
              <div className="what-we-do-tag">
                <h3>Tactile</h3>
              </div>
              <div className="what-we-do-tag">
                <h3>Light-forward</h3>
              </div>
              <div className="what-we-do-tag">
                <h3>Slow design</h3>
              </div>
              <div className="what-we-do-tag">
                <h3>Modular rhythm</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
