// ModulesAccordion.jsx
import React, { useState } from "react";

const MODULES = [
  {
    id: 1,
    title: "The Architecture of a World-Class CV That Impresses in 6 Seconds",
    meta: "Module 1 • Around 1 hour to complete",
    summary:
      "Understand how recruiters scan CV and what makes a CV instantly impressive.",
    details:
      "Master the proven structure behind world-class CV. Learn recruiter psychology, visual hierarchy, formatting, alignment, and layout techniques to create a clean, professional, and impossible-to-ignore CV.",
  },
  {
    id: 2,
    title: "Academic Storytelling: Crafting a Powerful Education Section",
    meta: "Module 2 • Around 1 hour to complete",
    summary:
      "Turn your education section into a credibility booster.",
    details:
      "Learn how to present your degree, GPA, coursework, certifications, and academic achievements in a structured and impactful way—even if you feel you have limited academic experience.",
  },
  {
    id: 3,
    title: "Crafting High-Impact Experience Bullets",
    meta: "Module 3 • Around 1 hour to complete",
    summary:
      "Write experience bullets that show impact, not just responsibilities.",
    details:
      "Learn how to craft result-driven bullet points, highlight leadership and skills, and align your experience with job descriptions to create a sharp, balanced, and memorable CV.",
  },
  {
    id: 4,
    title: "CV Mastery Live: From Draft to Recruiter-Ready CV",
    meta: "Module 4 • Around 1 hour to complete",
    summary:
      "Refine and elevate your CV to recruiter standards.",
    details:
      "Get your CV polished live—covering formatting, bullet strength, clarity, keyword alignment, and visual hierarchy—so it reads and looks like a top recruiter’s shortlist CV.",
  },
  {
    id: 5,
    title: "Your Signature CV: Polished, Professional & Placement-Ready",
    meta: "Module 5 • Around 1 hour to complete",
    summary:
      "Walk away with your final, submission-ready CV.",
    details:
      "Receive your fully edited, formatted, and finalized CV—perfected to represent your personal brand and ready to submit for internships, placements, and job applications.",
  },
];



export default function ModulesAccordion() {
  const [openId, setOpenId] = useState(0);
  const toggle = (id) => setOpenId((prev) => (prev === id ? 0 : id));

  return (
    <section className="max-w-8xl w-full bg-white/40 backdrop-blur-xl shadow-xl  border border-white/40 p-6 md:p-8"
    style={{
    background: "radial-gradient(circle, #F0FAFF 0%, #A7DDF3 40%, #6BB2D6 70%, #3A80A8 100%)",
  }}
    >
      <h3 className="text-lg md:text-xl font-bold text-black mb-3">
        There are 5 modules :
      </h3>

      <div className="space-y-3 text-black bg-transparent shadow-[0_24px_55px_rgba(15,23,42,0.35)] p-10">
        {MODULES.map((m) => (
          <ModuleItem
            key={m.id}
            module={m}
            isOpen={openId === m.id}
            onToggle={() => toggle(m.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ModuleItem({ module, isOpen, onToggle }) {
  return (
    <div
      className={`rounded-lg border transition-shadow duration-200 ${
        isOpen
          ? "border-black shadow-md bg-white/40"
          : "border-black/30 bg-white/20"
      }`}
    >
      {/* header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-4 focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`module-panel-${module.id}`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm md:text-base font-bold text-black">
              {module.title}
            </h4>
            <div className="text-xs text-black/80">{module.meta}</div>
          </div>

          <p className="mt-2 text-sm text-black/90">{module.summary}</p>
        </div>

        <div
          className={`ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${
            isOpen
              ? "bg-black text-white border-black"
              : "bg-white/40 text-black border-black/40"
          }`}
          aria-hidden="true"
        >
          <Chevron isOpen={isOpen} />
        </div>
      </button>

      {/* panel */}
      <div
        id={`module-panel-${module.id}`}
        className={`px-4 pb-4 transition-[max-height,opacity] duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 text-sm text-black/90">{module.details}</div>
      </div>
    </div>
  );
}

function Chevron({ isOpen }) {
  return (
    <svg
      className={`w-4 h-4 transform transition-transform duration-200 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8.5L10 13.5L15 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
