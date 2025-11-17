import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollGsap = ({
  elementRef,
  triggerRef,
  from,
  to,
  scrub = 1,
  start = "top bottom",
  end = "bottom top",
}) => {
  useEffect(() => {
    const trigger = triggerRef?.current || elementRef.current;
    if (!elementRef.current || !trigger) return;

    const anim = gsap.fromTo(elementRef.current, from, {
      ...to,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [elementRef, triggerRef, from, to, scrub, start, end]);
};
