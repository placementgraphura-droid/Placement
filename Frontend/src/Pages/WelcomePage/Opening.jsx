import React from "react";

const logos = [
  "/logos/myntra.svg",
  "/logos/realme.png",
  "/logos/lenskart.png",
  "/logos/bajaj.png",
  "/logos/geeks.png",
  "/logos/myntra.svg",
  "/logos/realme.png",
  "/logos/lenskart.png",
  "/logos/bajaj.png",
  "/logos/geeks.png",
];

const Opening = () => {
  return (
    <section className="w-full overflow-hidden bg-transparent py-4">
      <div className="relative w-full flex items-center gap-3 sm:gap-4">

        {/* Left Highlight Card */}
        <div
          className="
            shrink-0
            flex items-center
            bg-gradient-to-r from-[#63B6DD] to-[#1C7EAC]
            h-[56px] sm:h-[60px] md:h-[80px]
            w-[100px] sm:w-[160px] md:w-[260px]
            rounded-md md:rounded-lg
            px-3 sm:px-4 md:px-6
            shadow-xl
          "
        >
          {/* Divider */}
          <div className="h-8 sm:h-10 md:h-14 w-[3px] bg-white mr-3 sm:mr-4"></div>

          {/* Text */}
          <h3 className="text-white text-xs sm:text-lg md:text-2xl font-semibold tracking-wide">
            100+ Openings
          </h3>
        </div>

        {/* Logo Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-6 sm:gap-10 md:gap-12 animate-marquee">
            {[...logos, ...logos].map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="brand"
                className="
                  h-8 w-auto
                  sm:h-10
                  md:h-14
                  object-contain
                  drop-shadow-md
                "
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Opening;
