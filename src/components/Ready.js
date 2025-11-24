"use client";
import React from "react";
import Marquee from "react-fast-marquee";

const games = [
  "Valorant",
  "FiFA",
  "Cs:go",
  "Call of Duty",
  "Clash of Clans",
  "Rocket League",
  "Rainbow Six Siege",
  "Dota",
];

const Ready = () => {
  return (
    <section className="overflow-hidden bg-primary py-14 text-white md:py-16 lg:py-[88px] xl:py-[100px]">
      <Marquee pauseOnHover gradient={false}>
        <div className="flex items-center py-2">
          {games.map((game, idx) => (
            <div className="mr-12 flex items-center gap-8" key={idx}>
              <span className="whitespace-nowrap text-5xl font-medium leading-tight tracking-tighter sm:text-6xl md:text-5xl lg:text-7xl uppercase font-DurkBoldItalic">
                {game}
              </span>
              <span className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="w-8 h-8 md:w-10 md:h-10"
                >
                  <path
                    d="M20.002 0C20.002 0 19.789 11.2169 24.2871 15.7149C28.785 20.2129 40.002 20 40.002 20C40.002 20 28.785 19.7871 24.2871 24.2851C19.789 28.7831 20.002 40 20.002 40C20.002 40 20.2149 28.7831 15.7168 24.2851C11.2189 19.7871 0.00195312 20 0.00195312 20C0.00195312 20 11.2189 20.2129 15.7168 15.7149C20.2149 11.2169 20.002 0 20.002 0Z"
                    className="fill-white"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default Ready;
