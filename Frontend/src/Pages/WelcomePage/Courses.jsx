// CoursesForYou.jsx
import React from "react";

const courses = [
  {
    image: "/CV.png",
    title: "Resume Building",
    rating: "4.7",
    desc: "Essential skills to craft compelling resumes that stand out.",
    reviewed: "145+ students",
    links: "/courses",
  },
  {
    image: "/IN.png",
    title: "Interview Preparation",
    rating: "4.8",
    desc: "Understand the role, present yourself confidently, strong communication.",
    reviewed: "235+ students",
    links: "/interviews",
  },
  {
    image: "/Interview1.png",
    title: "Combo Package",
    rating: "4.6",
    desc: "Comprehensive course covering Resume building and interview preparation.",
    reviewed: "190+ students",
    links: "/courses",
  },
 
  // {
  //   title: "Group Discussion",
  //   rating: "4.5",
  //   desc: "Practice strategies to excel in group discussions during placements.",
  //   reviewed: "8+ students",
  // },
];

function Coursess() {
  return (
    <section
      className="relative w-full py-16 bg-gradient-to-r flex justify-between from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC] bg-opacity-30 overflow-hidden"
    >
      {/* Soft glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_60%)] opacity-60" />
        <div className="absolute right-[-80px] bottom-[-40px] w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_60%)] opacity-60" />
      </div>

      {/* Width-controlled container */}
    <div className="relative w-full px-8 md:px-16">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-8">
  <span className="h-8 w-[3px] bg-[#1C7EAC] rounded-full" />
  <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
    Courses for You
  </h2>
</div>


        {/* Cards row */}
<div className="flex justify-around flex-wrap gap-6 ">
          {courses.map((course, idx) => (
            
            <div
              key={idx}
              className="flex-1 min-w-[260px] max-w-sm rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_18px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_24px_55px_rgba(15,23,42,0.35)] transition-shadow duration-300 p-5"
            >
              <a href={course.links}>

              {/* Top placeholder image area */}
              <div className="rounded-2xl bg-slate-200/70 mb-5" >
              <img src={course.image} alt={course.title} className="bg-cover h-full rounded-2xl mb-5" />
              </div>
              {/* Title + rating pill */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base md:text-lg font-semibold text-slate-900">
                  {course.title}
                </h3>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/80 text-slate-700 shadow-sm">
                  {course.rating}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-700 mb-4 leading-snug">
                {course.desc}
              </p>

              {/* Enroll button */}
              <a href="/intern-login">
              <button className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-semibold text-sky-700 bg-white rounded-full shadow-sm hover:bg-sky-50 transition-colors">
                Enroll Now
              </button>
              </a>

              </a>
              {/* Reviewed text */}
              <p className="mt-3 text-[11px] text-slate-600">
                Reviewed by {course.reviewed}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Coursess;
