"use client";
import { useEffect } from "react";
import { preLoaderAnim } from "./loader";

export default function PreLoader() {
  useEffect(() => {
    preLoaderAnim();
  }, []);

  return (
    <div className="loader">
      <div className="marquee-wrapper">
        <div className="marquee marquee-1">
          <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee marquee-2">
          <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee marquee-3">
          <h1>SPAWN POINT SPAWN POINT SPAWN POINT SPAWN POINT </h1>
        </div>
      </div>

      <div className="overlay">
        <div className="blocker"></div>
        <div className="blocker"></div>
      </div>

      <div className="intro-logo">
        <div className="word" id="word-1">
          <h1>
            <span>Spawn</span>
          </h1>
        </div>
        <div className="word" id="word-2">
          <h1>Point</h1>
        </div>
      </div>

      <div className="divider"></div>
    </div>
  );
}
