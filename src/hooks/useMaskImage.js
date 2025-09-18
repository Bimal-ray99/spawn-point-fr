// hooks/useMaskImage.js
import { useTransform } from "framer-motion";

export default function useMaskImage(localProgress, isMobile, config) {
  const {
    divisions = 28,
    inset = 0,
    gap = 0.35,
    vh = 130,
    color = "#0057ff",
  } = config ?? {};

  const func = (i, latest) => {
    const buffer = (1 - 2 * inset - gap) / (divisions - 1);
    if (inset + i * buffer > latest) return 0;
    if (inset + gap + i * buffer < latest) return 1;
    return (latest - (inset + i * buffer)) / gap;
  };

  // Convert hex color to RGB values
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 87, b: 255 }; // Default to #0057ff
  };

  const rgb = hexToRgb(color);

  const maskImage = useTransform(localProgress, (latest) => {
    if (typeof isMobile != "boolean") return "";
    else if (isMobile) {
      return `linear-gradient(to top,rgba(${rgb.r},${rgb.g},${
        rgb.b
      },0) 0%,rgba(${rgb.r},${rgb.g},${rgb.b},0) ${latest * 100}% ,rgba(${
        rgb.r
      },${rgb.g},${rgb.b},1) ${latest * 100}%,rgba(${rgb.r},${rgb.g},${
        rgb.b
      },1) 100%)`;
    }
    let temp = "";

    for (let i = 0; i < divisions; i++) {
      temp += `rgba(${rgb.r},${rgb.g},${rgb.b},0) ${
        i * (vh / divisions)
      }vh ,rgba(${rgb.r},${rgb.g},${rgb.b},0) ${
        func(i, latest) * (vh / divisions) + i * (vh / divisions)
      }vh,rgba(${rgb.r},${rgb.g},${rgb.b},1) ${
        func(i, latest) * (vh / divisions) + i * (vh / divisions)
      }vh,rgba(${rgb.r},${rgb.g},${rgb.b},1) ${(i + 1) * (vh / divisions)}vh`;
      if (i != divisions - 1) temp += ",";
    }
    return `linear-gradient(to top,${temp})`;
  });

  return maskImage;
}
