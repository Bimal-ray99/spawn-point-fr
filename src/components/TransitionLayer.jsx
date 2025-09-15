"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

export default function TransitionLayer() {
  const rootRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isNavigating, setIsNavigating] = useState(false);
  const [didInitialReveal, setDidInitialReveal] = useState(false);

  // Toggle this if you want the very first page load to play the mask
  const ENABLE_INITIAL_REVEAL = true;
  // Delay so the page paints before the first mask runs
  const INITIAL_REVEAL_DELAY_MS = 200;

  const q = (sel) => rootRef.current?.querySelector(sel);

  const isExternal = (href = "") =>
    /^(https?:)?\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  const isSamePage = (href) => {
    if (!href || href === "#" || href === "") return true;
    const cur = window.location.pathname;
    if (href === cur) return true;
    if (
      (cur === "/" || cur === "/index.html") &&
      (href === "/" ||
        href === "/index.html" ||
        href === "index.html" ||
        href === "./index.html")
    ) {
      return true;
    }
    const curFile = cur.split("/").pop() || "index.html";
    const hrefFile = href.split("/").pop();
    return curFile === hrefFile;
  };

  // Build SVG mask (namespace-safe, unique id, userSpaceOnUse)
  const buildMaskSVG = () => {
    const host = q(".mask-transition");
    const bg = q(".mask-bg-overlay");
    if (!host || !bg) return {};

    host.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute(
      "viewBox",
      `0 0 ${window.innerWidth} ${window.innerHeight}`
    );

    const defs = document.createElementNS(NS, "defs");
    const mask = document.createElementNS(NS, "mask");
    const maskId = `logoRevealMask-${Date.now()}-${Math.round(
      Math.random() * 1e6
    )}`;
    mask.setAttribute("id", maskId);
    mask.setAttribute("maskUnits", "userSpaceOnUse");

    const full = document.createElementNS(NS, "rect");
    full.setAttribute("x", "0");
    full.setAttribute("y", "0");
    full.setAttribute("width", "100%");
    full.setAttribute("height", "100%");
    // Keep white here: in a mask, white = keep (shows rect below), black = cut
    full.setAttribute("fill", "white");

    const path = document.createElementNS(NS, "path");
    path.setAttribute(
      "d",
      "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z"
    );
    path.setAttribute("fill", "black"); // cuts a hole

    mask.appendChild(full);
    mask.appendChild(path);
    defs.appendChild(mask);

    // The “solid sheet” we reveal is your site bg token
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    // Use CSS var with fallback so it matches your theme (no white flash)
    rect.setAttribute("style", "fill: var(--color-backgroundDark, #0f0f10);");
    rect.setAttribute("mask", `url(#${maskId})`);

    svg.appendChild(defs);
    svg.appendChild(rect);
    host.appendChild(svg);

    return { svg, path, bg, host };
  };

  // Measure/center path to ~60px initial size at viewport center
  const getInitialTransform = () => {
    const NS = "http://www.w3.org/2000/svg";
    const tempSvg = document.createElementNS(NS, "svg");
    const tempPath = document.createElementNS(NS, "path");
    tempPath.setAttribute(
      "d",
      "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z"
    );
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);
    const bbox = tempPath.getBBox();
    document.body.removeChild(tempSvg);

    const logoSize = 60;
    const scale = logoSize / Math.max(bbox.width, bbox.height);
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    const vx = window.innerWidth / 2;
    const vy = window.innerHeight / 2;
    const tx = vx - cx * scale;
    const ty = vy - cy * scale;

    return { bbox, scale, tx, ty };
  };

  // Masked reveal (initial or after nav)
  const revealMask = async ({ initial = false } = {}) => {
    const overlay = q(".transition-overlay");
    const { path, bg, host } = buildMaskSVG();
    if (!overlay || !path || !bg || !host) return;

    const { bbox, scale, tx, ty } = getInitialTransform();
    path.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scale})`);

    // Show mask layers; on initial run we keep backdrop at 0 to avoid “white wash”
    gsap.set(host, { display: "block" });
    gsap.set(bg, { display: "block", opacity: initial ? 0 : 0.28 });

    // Handoff: new page is revealed through the mask, so hide overlay now
    gsap.set(overlay, { display: "none" });

    const mult = window.innerWidth < 1000 ? 14 : 36;

    await new Promise((resolve) => {
      gsap.to(
        {},
        {
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate() {
            const p = this.progress();
            const s = scale + p * mult;

            const vx = window.innerWidth / 2;
            const vy = window.innerHeight / 2;
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;

            const nx = vx - cx * s;
            const ny = vy - cy * s;

            path.setAttribute(
              "transform",
              `translate(${nx}, ${ny}) scale(${s})`
            );

            if (!initial) {
              const fade = Math.min(0.28, p * 0.5);
              gsap.set(bg, { opacity: 0.28 - fade });
            }
          },
          onComplete() {
            gsap.set(host, { display: "none" });
            gsap.set(bg, { display: "none" });
            gsap.set(overlay, {
              display: "block",
              scaleY: 0,
              transformOrigin: "bottom",
            });
            resolve();
          },
        }
      );
    });
  };

  const runPageTransition = async (href) => {
    const overlay = q(".transition-overlay");
    const logo = q(".transition-logo");
    if (!overlay || !logo) return;

    const bigScale = Math.max(window.innerWidth, window.innerHeight) / 9 + 10;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.set(overlay, { display: "block", transformOrigin: "bottom" })
      .to(overlay, { scaleY: 1, duration: 0.55 }) // keep covered
      .set(logo, { autoAlpha: 1, top: "120%" }, "<")
      .to(logo, { top: "50%", opacity: 1, duration: 0.55 }, "<0.05")
      .to(logo, {
        scale: bigScale,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onStart: () => {
          setIsNavigating(true);
          router.push(href);
        },
        onComplete: () => {
          gsap.set(overlay, { display: "none", scaleY: 0 });
          gsap.set(logo, { autoAlpha: 0, top: "120%", scale: 1 });
        },
      });
  };

  useEffect(() => {
    const overlay = q(".transition-overlay");
    const logo = q(".transition-logo");
    if (overlay && logo) {
      gsap.set(overlay, {
        display: "none",
        scaleY: 0,
        transformOrigin: "bottom",
      });
      gsap.set(logo, { autoAlpha: 0, top: "120%", scale: 1 });
    }

    if (ENABLE_INITIAL_REVEAL && !didInitialReveal) {
      const t = setTimeout(() => {
        revealMask({ initial: true }).finally(() => setDidInitialReveal(true));
      }, INITIAL_REVEAL_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      const target = e.target;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (!href || isExternal(href)) return;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        link.target === "_blank"
      )
        return;

      e.preventDefault();
      if (isSamePage(href)) return;

      runPageTransition(href);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (isNavigating) {
      revealMask({ initial: false }).finally(() => setIsNavigating(false));
    }
  }, [pathname]);

  return (
    <div ref={rootRef}>
      {/* Overlay + logo (persistent across routes) */}
      <div className="transition pointer-events-none">
        <div className="transition-overlay overlay" />
        <div className="transition-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>

      {/* Masked reveal layers (shown as needed) */}
      <div className="mask-transition" />
      <div className="mask-bg-overlay" />
    </div>
  );
}
