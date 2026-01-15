import React from "react";

const testimonials = [
  {
    title: "Got My Dream Job at Myntra",
    text: "After improving my CV through Graphura’s CV masterclass, I was directly contacted by HR. I cleared the interview and landed my dream role within 10 days. Truly grateful to the Graphura team!",
    name: "Karan Bhat",
    img: "/9.webp",
    role: "Graphic Designer",
  },
  {
    title: "From Learning to Hiring at Myntra",
    text: "Graphura helped me structure my profile and prepare confidently. The mentorship and CV review made a huge difference, and I secured my role faster than expected.",
    name: "Neeraj Singh",
    img: "/12.webp",
    role: "Marketing Executive",
  },
  {
    title: "Design Career Breakthrough",
    text: "The guidance and portfolio feedback I received at Graphura were extremely valuable. I felt confident during interviews and successfully transitioned into a product design role.",
    name: "Sneha Patel",
    img: "/7.webp",
    role: "Product Designer",
  },
  {
    title: "UI Designer Role Achieved",
    text: "Graphura’s structured preparation and real interview insights helped me crack my UI Designer interview smoothly. Highly recommended for career-focused learning.",
    name: "Varun Soni",
    img: "/16.webp",
    role: "UI Designer",
  },
  {
    title: "Cracked My First Tech Role at Infosys",
    text: "With Graphura’s roadmap and mock interviews, I refined my resume and interview skills. I cleared Infosys in my first attempt. The mentorship was top-notch.",
    name: "Amit Verma",
    img: "/5.webp",
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
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
  {testimonials.map((item, idx) => (
    <div
      key={idx}
      className="flex flex-col justify-between bg-gradient-to-b from-sky-200/80 via-white/90 to-sky-50/90 
      backdrop-blur-xl border border-white/70 rounded-2xl px-5 py-5 text-black 
      shadow-[0_12px_30px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Title */}
      <h3 className="text-sm font-semibold mb-2 leading-snug">
        {item.title}
      </h3>

      {/* Content */}
      <p className="text-xs leading-relaxed text-neutral-800 flex-grow">
        {item.text}
      </p>

      {/* Divider */}
      <div className="h-px w-full bg-black/10 my-4" />

      {/* Profile */}
      <div className="flex items-center gap-3">
        <img
          src={item.img}
          alt={item.name}
          className="w-9 h-9 rounded-full object-cover border border-white"
        />

        <div className="leading-tight">
          <p className="text-xs font-semibold">
            {item.name}
          </p>
          <p className="text-[10px] text-neutral-600">
            {item.role}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default Testimonials;
