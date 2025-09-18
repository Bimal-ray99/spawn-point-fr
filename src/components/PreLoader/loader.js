import gsap from "gsap";

export const preLoaderAnim = () => {
  const tl = gsap.timeline();

  tl.fromTo(
    ".marquee-1",
    { x: "-150%" },
    { x: "0%", duration: 3, ease: "power2.out" }
  )
    .fromTo(
      ".marquee-2",
      { x: "100%" },
      { x: "-40%", duration: 3, ease: "power2.out" },
      "<"
    )
    .fromTo(
      ".marquee-3",
      { x: "-150%" },
      { x: "0%", duration: 3, ease: "power2.out" },
      "<"
    )
    // Wait 1.5s before exit animation to hit 5s total
    .to(
      ".preloader",
      {
        y: "-100vh",
        duration: 1.5,
        ease: "power3.inOut",
      },
      "+=0.5"
    ) // delay exit
    .set(".preloader", { display: "none" });
};
