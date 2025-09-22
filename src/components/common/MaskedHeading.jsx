import clsx from "clsx";
import bgImage from "../../../public/images/bg/bg-1.png";

export default function MaskedHeading({
  text = "spawnpoint",
  className = "",
  positionClass = `absolute md:bottom-[-6rem] z-0`,
}) {
  const combinedClasses = clsx(
    "absolute z-0 flex justify-center",
    positionClass,
    className
  );

  return (
    <div className={combinedClasses}>
      <div className="w-full">
        <h1
          className="text-[80vw] font-DurkItalic uppercase tracking-wider leading-none opacity-[8%] select-none"
          style={{
            backgroundImage: `url(/images/bg/main-home-rev-3.png)`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "400px 400px",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {text}
        </h1>
      </div>
    </div>
  );
}
