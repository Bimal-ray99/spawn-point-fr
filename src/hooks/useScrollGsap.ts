// hooks/useScrollGsap.ts
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollGsapOptions = {
  elementRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>; // make optional
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  scrub?: boolean | number;
  start?: string;
  end?: string;
};

export const useScrollGsap = ({
  elementRef,
  triggerRef,
  from,
  to,
  scrub = 1,
  start = "top bottom",
  end = "bottom top",
}: ScrollGsapOptions) => {
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
  }, [elementRef, triggerRef]);
};
