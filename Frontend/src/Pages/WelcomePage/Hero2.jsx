import React from "react";

const Hero2 = () => {
  return (
    <section
      className="
        relative 
        w-full 
        min-h-[40vh] 
        md:min-h-screen
        flex 
        items-center 
        justify-center
        bg-center 
        bg-no-repeat 
        bg-cover
      "
      style={{ backgroundImage: `url(${'/hero2bg.png'})` }}
    >
    </section>
  );
};

export default Hero2;
