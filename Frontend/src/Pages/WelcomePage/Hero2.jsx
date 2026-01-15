import React from "react";

const Hero2 = () => {
  return (
    <section
      className="
        relative
        w-full
        min-h-[50vh]
        sm:min-h-[60vh]
        md:min-h-screen
        flex
        items-center
        justify-center
        bg-center
        bg-no-repeat
        bg-cover
      "
      style={{
        backgroundImage: "url('/hero2bg.webp')",
        backgroundPosition: "center",
      }}
    >
      {/* Optional overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
};

export default Hero2;
