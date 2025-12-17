import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("smooth", "0.4, 0, 0.2, 1");

export const preLoaderAnim = () => {
  const tl = gsap.timeline({
    delay: 0.3,
    defaults: { ease: "hop" },
  });

  // -------------------------------------------------------
  // 🔵 MARQUEE TEXT ANIMATION (slides in from sides)
  // -------------------------------------------------------
  tl.fromTo(
    ".marquee-1",
    { x: "-150%" },
    { x: "30%", duration: 2.5, ease: "power2.out" }
  )
    .fromTo(
      ".marquee-2",
      { x: "120%" },
      { x: "-40%", duration: 2.5, ease: "power2.out" },
      "<"
    )
    .fromTo(
      ".marquee-3",
      { x: "-200%" },
      { x: "-30%", duration: 2.5, ease: "power2.out" },
      "<"
    );

  // -------------------------------------------------------
  // ✨ VERTICAL DIVIDER LINE SCALES DOWN
  // -------------------------------------------------------
  tl.to(
    ".divider",
    {
      scaleY: 1,
      duration: 0.8,
      ease: "power3.inOut",
    },
    "-=0.5"
  );

  // -------------------------------------------------------
  // 🔀 TEXT + OVERLAY GO UP TOGETHER (one by one)
  // -------------------------------------------------------
  // Left side - text and blocker go up together
  tl.to(
    [".split-text-left", ".blocker-left"],
    {
      y: "-100%",
      duration: 1,
      ease: "power3.inOut",
      onStart: () => {
        gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" });
      },
    },
    "+=0.3"
  )
    // Right side - text and blocker go up together (staggered)
    .to(
      [".split-text-right", ".blocker-right"],
      {
        y: "-100%",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(".loader", { pointerEvents: "none", display: "none" });
        },
      },
      "-=0.6"
    )
    .to(
      ".divider",
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.8"
    );

  return tl;
};
