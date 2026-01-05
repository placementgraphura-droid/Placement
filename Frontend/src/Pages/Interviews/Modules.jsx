// ModulesAccordion.jsx
import React, { useState } from "react";

const MODULES = [
  {
    id: 1,
    title: "Unlock Role Secrets: Prepare Like a Top Candidate Every Time",
    meta: "Module 1 • Around 1 hour to complete",
    summary:
      "Understand how different companies—from startups to MNCs—expect candidates to perform.",
    details:
      "Learn how organizations evaluate candidates, what they prioritize, and how to strategically tailor your responses to align with company expectations and stand out as a top choice.",
  },
  {
    id: 2,
    title: "Mock Interview Mastery: Turn Practice Into Performance",
    meta: "Module 2 • Around 1 hour to complete",
    summary:
      "Experience HR interviews like never before and build confidence through structured practice.",
    details:
      "Master behavioral interviews by delivering measurable, impact-driven answers. Learn proven response structures and develop the poise to handle challenging interview situations confidently.",
  },
  {
    id: 3,
    title: "Think, Solve, Impress: Live Technical Simulation & Analysis",
    meta: "Module 3 • Around 1 hour to complete",
    summary:
      "Showcase structured reasoning, prioritization, and solution-driven thinking.",
    details:
      "Participate in live technical and analytical simulations, receive detailed performance analysis, and get personalized improvement plans to outperform peers in real interviews.",
  },
  {
    id: 4,
    title: "Land Interviews Faster: Resume, LinkedIn & Portfolio Mastery",
    meta: "Module 4 • Around 1 hour to complete",
    summary:
      "Align your resume, LinkedIn profile, and portfolio for maximum recruiter impact.",
    details:
      "Learn ATS-friendly formatting, keyword optimization, and proof-backed presentation strategies that significantly improve visibility and increase interview callbacks.",
  },
  {
    id: 5,
    title: "The Ultimate Mock Interview: Test, Score & Transform",
    meta: "Module 5 • Around 1 hour to complete",
    summary:
      "Integrate everything you’ve learned through full-length mock interviews.",
    details:
      "Complete comprehensive mock interviews, receive a structured performance scorecard, and get a personalized roadmap to confidently navigate and accelerate your career path.",
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
