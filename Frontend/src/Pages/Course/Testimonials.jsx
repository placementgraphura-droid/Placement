import React from "react";

const testimonials = [
  {
    title: "Landed My Dream Job at Myntra",
    text: "After refining my CV through Graphura’s CV Masterclass, I was directly contacted by HR. I cleared the interview and secured my dream role within just 10 days. Truly grateful to the Graphura team!",
    name: "Karan Bhat",
    img: "/9.webp",
    role: "Graphic Designer",
  },
  {
    title: "From Learning to Getting Hired",
    text: "Graphura helped me structure my profile and prepare with confidence. The mentorship and CV review made a huge impact, and I landed my role much faster than I expected.",
    name: "Neeraj Singh",
    img: "/6.webp",
    role: "Marketing Executive",
  },
  {
    title: "A Major Breakthrough in My Design Career",
    text: "The portfolio feedback and career guidance I received at Graphura were incredibly valuable. I walked into interviews with confidence and successfully transitioned into a product design role.",
    name: "Sneha Patel",
    img: "/3.webp",
    role: "Product Designer",
  },
  {
    title: "Successfully Cracked a UI Designer Interview",
    text: "Graphura’s structured preparation and real-world interview insights helped me crack my UI Designer interview smoothly. Highly recommended for anyone serious about their career.",
    name: "Varun Soni",
    img: "/16.webp",
    role: "UI Designer",
  },
  {
    title: "Cleared My First Tech Interview at Infosys",
    text: "With Graphura’s clear roadmap and mock interviews, I refined both my CV and interview skills. I cleared Infosys on my first attempt. The mentorship was truly top-notch.",
    name: "Amit Verma",
    img: "/10.webp",
    role: "Frontend Developer",
  },
];


const Testimonials = () => {
  return (
    <section
      className="w-full bg-white/40 backdrop-blur-xl shadow-xl border border-white/40 p-6 md:p-10"
      style={{
        background:
          "radial-gradient(circle, #E3F9FF 0%, #AEE7F6 45%, #5FB2D4 100%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-black mb-8">
          Why people choose GRAPHURA for their career
        </h2>

        {/* Cards */}
{/* Scrolling Wrapper */}
<div className="relative overflow-hidden">
<div className="flex w-max gap-6 m-10 animate-scroll hover:[animation-play-state:paused]">
    {[...testimonials, ...testimonials].map((item, idx) => (
      <div
        key={idx}
        className="min-w-[260px] max-w-[260px] flex-shrink-0 flex flex-col justify-between
        bg-gradient-to-b from-sky-200/80 via-white/90 to-sky-50/90 
        backdrop-blur-xl border border-white/70 rounded-2xl px-5 py-5 text-black 
        shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <h3 className="text-sm font-semibold mb-2 leading-snug">
          {item.title}
        </h3>

        <p className="text-xs leading-relaxed text-neutral-800 flex-grow">
          {item.text}
        </p>

        <div className="h-px w-full bg-black/10 my-4" />

        <div className="flex items-center gap-3">
          <img
            src={item.img}
            alt={item.name}
            className="w-9 h-9 rounded-full object-cover border border-white"
          />
          <div className="leading-tight">
            <p className="text-xs font-semibold">{item.name}</p>
            <p className="text-[10px] text-neutral-600">{item.role}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


      </div>
    </section>
  );
};

export default Testimonials;
