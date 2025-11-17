import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export const preLoaderAnim = () => {
  const tl = gsap.timeline({
    delay: 0.3,
    defaults: { ease: "hop" },
  });

  // -------------------------------------------------------
  // 🔵 MARQUEE TEXT ANIMATION (background)
  // -------------------------------------------------------
  tl.fromTo(
    ".marquee-1",
    { x: "-150%" },
    { x: "30%", duration: 3, ease: "power2.out" }
  )
    .fromTo(
      ".marquee-2",
      { x: "120%" },
      { x: "-40%", duration: 3, ease: "power2.out" },
      "<"
    )
    .fromTo(
      ".marquee-3",
      { x: "-200%" },
      { x: "-30%", duration: 3, ease: "power2.out" },
      "<"
    );

  // -------------------------------------------------------
  // 🔢 COUNTER ANIMATION
  // -------------------------------------------------------
  const counts = document.querySelectorAll(".count");

  counts.forEach((count, index) => {
    const digits = count.querySelectorAll(".digit h1");

    // Enter animation
    tl.to(
      digits,
      {
        y: "0%",
        duration: 1,
        stagger: 0.075,
      },
      index * 1
    );

    // Exit animation
    tl.to(
      digits,
      {
        y: "-100%",
        duration: 1,
        stagger: 0.075,
      },
      index * 1 + 1
    );
  });

  // -------------------------------------------------------
  // ❗ FADE OUT MARQUEE AFTER COUNTER ENDS
  // -------------------------------------------------------
  tl.to(".marquee-wrapper", {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  // -------------------------------------------------------
  // 🔄 SPINNER FADE OUT
  // -------------------------------------------------------
  tl.to(".spinner", {
    opacity: 0,
    duration: 0.3,
  });

  // -------------------------------------------------------
  // ✨ WORDS (SPAWN / POINT) REVEAL
  // -------------------------------------------------------
  tl.to(
    ".word h1",
    {
      y: "0%",
      duration: 1,
    },
    "<"
  );

  // -------------------------------------------------------
  // | DIVIDER ANIMATION |
  // -------------------------------------------------------
  tl.to(".divider", {
    scaleY: "100%",
    duration: 1,
    onComplete: () =>
      gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 }),
  });

  // -------------------------------------------------------
  // WORD EXIT (SPAWN ↓ , POINT ↑)
  // -------------------------------------------------------
  tl.to("#word-1 h1", {
    y: "100%",
    duration: 1,
    delay: 0.3,
  });

  tl.to(
    "#word-2 h1",
    {
      y: "-100%",
      duration: 1,
    },
    "<"
  );

  gsap.to(".blocker", { zIndex: 10 });

  // -------------------------------------------------------
  // 🔴 blocker EXIT + FINISH
  // -------------------------------------------------------
  tl.to(
    ".blocker",
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      delay: 0.75,
      onStart: () => {
        gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" });
      },
      onComplete: () => {
        gsap.set(".loader", { pointerEvents: "none" });
      },
    },
    "<"
  );

  return tl;
};
