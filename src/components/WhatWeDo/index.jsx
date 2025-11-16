"use client";
import { useEffect, useState } from "react";
import WhatWeDo from "./WhatWeDo";
import WhatWeDoMobile from "./WhatWeDo.mobile";

export default function WhatWeDoResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <WhatWeDoMobile /> : <WhatWeDo />;
}
