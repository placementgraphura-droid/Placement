import React from "react";

const partners = [
  { img: "/logos/udemy.png", name: "Udemy" },
  { img: "/logos/lenskart.png", name: "Lenskart" },
  { img: "/logos/myntra.svg", name: "Myntra" },
  { img: "/logos/geeks.png", name: "Geeks for Geeks" },
  { img: "/logos/bajaj.png", name: "Bajaj" },
  { img: "/logos/policy.png", name: "Policy Bazaar" },
  { img: "/logos/realme.png", name: "Realme" },
];

const Partners = () => {
  return (
    <section
      className="
        w-full py-16 overflow-hidden
        bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC]
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
          Proud to be partnered with trusted companies
        </h2>

        {/* SCROLLER */}
        <div className="relative">
          <div className="flex gap-10 animate-scroll hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col items-center"
              >
                <div
                  className="
                    w-[110px] h-[110px] md:w-[150px] md:h-[150px]
                    rounded-2xl bg-white/60 backdrop-blur-md
                    border border-white/40 shadow-lg
                    flex items-center justify-center
                  "
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>
                <p className="mt-3 font-medium text-gray-800">
                  {p.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
