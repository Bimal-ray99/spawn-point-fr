import React from "react";

const ShapeDeco = ({
  position = "top-right",
  primaryColor = "bg-primary",
  secondaryColor = "bg-secondary",
  height = 80, // Default height in pixels for desktop
  width = "100%", // Default width
  className = "", // Additional classes for the container
  rotate = false, // Whether to rotate the shape
  rotationDegrees = 180, // Default rotation in degrees if rotate is true
  mirrorX = false, // Horizontal mirroring
  mirrorY = false, // Vertical mirroring
}) => {
  // Calculate positions based on the selected preset
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-0 right-0";
      case "top-left":
        return "top-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      default:
        return "top-0 right-0";
    }
  };

  // Get clip path based on position
  const getClipPath = () => {
    let basePath;

    switch (position) {
      case "top-right":
        basePath = "polygon(0 0, 100% 0, 100% 40%, 5% 40%)";
        break;
      case "top-left":
        basePath = "polygon(0 0, 100% 0, 95% 40%, 0 40%)";
        break;
      case "bottom-right":
        basePath = "polygon(5% 60%, 100% 60%, 100% 100%, 0 100%)";
        break;
      case "bottom-left":
        basePath = "polygon(0 60%, 95% 60%, 100% 100%, 0 100%)";
        break;
      default:
        basePath = "polygon(0 0, 100% 0, 100% 40%, 5% 40%)";
    }

    return basePath;
  };

  // Calculate responsive heights
  const mobileHeight = Math.max(Math.floor(height * 0.5), 30); // At least 30px on mobile
  const tabletHeight = Math.max(Math.floor(height * 0.7), 40); // At least 40px on tablet

  // Build transform style with rotation and mirroring
  const getTransformStyle = (baseHeight) => {
    let transforms = [];

    // Add rotation if specified
    if (rotate) {
      transforms.push(`rotate(${rotationDegrees}deg)`);
    }

    // Add horizontal mirroring if specified
    if (mirrorX) {
      transforms.push("scaleX(-1)");
    }

    // Add vertical mirroring if specified
    if (mirrorY) {
      transforms.push("scaleY(-1)");
    }

    return transforms.length ? transforms.join(" ") : "none";
  };

  return (
    <>
      {/* Mobile version */}
      <div
        className={`absolute ${getPositionClasses()} ${className} block md:hidden`}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: `${mobileHeight}px`,
          transform: getTransformStyle(mobileHeight),
        }}
      >
        <div
          className={primaryColor}
          style={{
            width: "100%",
            height: "100%",
            clipPath: getClipPath(),
          }}
        />
      </div>

      {/* Tablet version */}
      <div
        className={`absolute ${getPositionClasses()} ${className} hidden md:block lg:hidden`}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: `${tabletHeight}px`,
          transform: getTransformStyle(tabletHeight),
        }}
      >
        <div
          className={primaryColor}
          style={{
            width: "100%",
            height: "100%",
            clipPath: getClipPath(),
          }}
        />
      </div>

      {/* Desktop version */}
      <div
        className={`absolute ${getPositionClasses()} ${className} hidden lg:block`}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: `${height}px`,
          transform: getTransformStyle(height),
        }}
      >
        <div
          className={primaryColor}
          style={{
            width: "100%",
            height: "100%",
            clipPath: getClipPath(),
          }}
        />
      </div>
    </>
  );
};

export default ShapeDeco;
