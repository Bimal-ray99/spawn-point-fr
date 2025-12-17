"use client";
import { useEffect } from "react";
import { preLoaderAnim } from "./loader";

export default function PreLoader() {
  useEffect(() => {
    preLoaderAnim();
  }, []);

  return (
    <div className="loader">
      {/* Split Text Container - Left Half */}
      <div className="split-text-left">
        <div className="marquee-container">
          <div className="marquee marquee-1">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
        <div className="marquee-container">
          <div className="marquee marquee-2">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
        <div className="marquee-container">
          <div className="marquee marquee-3">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
      </div>

      {/* Split Text Container - Right Half (mirrored) */}
      <div className="split-text-right">
        <div className="marquee-container">
          <div className="marquee marquee-1">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
        <div className="marquee-container">
          <div className="marquee marquee-2">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
        <div className="marquee-container">
          <div className="marquee marquee-3">
            <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
          </div>
        </div>
      </div>

      {/* Vertical Center Divider Line */}
      <div className="divider"></div>

      {/* Overlay Blockers that wipe away (vertical split) */}
      <div className="overlay">
        <div className="blocker blocker-left"></div>
        <div className="blocker blocker-right"></div>
      </div>
    </div>
  );
}
