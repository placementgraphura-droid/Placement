// ModulesAccordion.jsx
import React, { useState } from "react";

const MODULES = [
  {
    id: 1,
    title: "Crack the Interview Code: How Companies Really Select Candidates",
    meta: "Module 1 • Around 1 hour to complete",
    summary:
      "Understand how hiring decisions are actually made behind the scenes.",
    details:
      "Shift from a job-seeker mindset to a value-delivery professional. Learn how resumes are screened, interviews are scored, and offers are finalized—so you approach every recruitment process with clarity, confidence, and a competitive edge.",
  },
  {
    id: 2,
    title: "Nail the HR Call: First 60 Seconds to Win",
    meta: "Module 2 • Around 1 hour to complete",
    summary:
      "Master the first HR interaction that decides your interview journey.",
    details:
      "Learn powerful frameworks like SIV and EIM to structure answers effectively. Understand what recruiters listen for in the first call and how to present your achievements and skills strategically to stand out immediately.",
  },
  {
    id: 3,
    title: "Crack Behavioral Interviews: STAR, CARL & SOAR Made Easy",
    meta: "Module 3 • Around 1 hour to complete",
    summary:
      "Answer behavioral questions with clarity, confidence, and impact.",
    details:
      "Most candidates fail behavioral rounds due to vague answers. Learn STAR, CARL, and SOAR frameworks to showcase leadership, decision-making, problem-solving, and teamwork in a way that clearly demonstrates your value.",
  },
  {
    id: 4,
    title: "From JD to Answer: Technical & Analytical Interview Mastery",
    meta: "Module 4 • Around 1 hour to complete",
    summary:
      "Convert job descriptions into winning interview answers.",
    details:
      "Decode job descriptions, identify core skills, and present your technical knowledge confidently. Learn how to explain projects, tools, and problem-solving approaches in domain-specific interviews.",
  },
  {
    id: 5,
    title: "Interview Strategy & Salary Secrets: Maximize Your Offer",
    meta: "Module 5 • Around 1 hour to complete",
    summary:
      "Negotiate confidently and secure offers that reflect your true worth.",
    details:
      "Learn how to negotiate without sounding desperate. Master proven strategies like BATNA and Anchoring to demonstrate value, handle salary discussions professionally, and maximize your compensation.",
  },
  {
    id: 6,
    title: "Unlock Role Secrets: Prepare Like a Top Candidate Every Time",
    meta: "Module 6 • Around 1 hour to complete",
    summary:
      "Adapt your interview strategy for startups, MNCs, and everything in between.",
    details:
      "Understand how different companies evaluate candidates and what they prioritize. Learn how to tailor your responses strategically to match expectations and consistently stand out as a top choice.",
  },
  {
    id: 7,
    title: "Mock Interview Mastery: Turn Practice Into Performance",
    meta: "Module 7 • Around 1 hour to complete",
    summary:
      "Build confidence through realistic mock HR interviews.",
    details:
      "Experience interview simulations that mirror real hiring scenarios. Learn to deliver measurable, impact-driven answers and develop the poise to handle pressure and unexpected questions confidently.",
  },
  {
    id: 8,
    title: "Think, Solve, Impress: Live Technical Simulation & Analysis",
    meta: "Module 8 • Around 1 hour to complete",
    summary:
      "Stand out with structured thinking and solution-oriented reasoning.",
    details:
      "Participate in live technical and analytical simulations. Receive detailed performance analysis, expert feedback, and personalized improvement plans to outperform peers in real interviews.",
  },
  {
    id: 9,
    title: "Land Interviews Faster: Resume, LinkedIn & Portfolio Mastery",
    meta: "Module 9 • Around 1 hour to complete",
    summary:
      "Optimize your professional profiles for recruiter visibility.",
    details:
      "Learn ATS-friendly resume formatting, keyword optimization, and proof-backed presentation strategies for LinkedIn and portfolios to significantly increase interview callbacks.",
  },
  {
    id: 10,
    title: "The Ultimate Mock Interview: Test, Score & Transform",
    meta: "Module 10 • Around 1 hour to complete",
    summary:
      "Put everything together in full-length interview simulations.",
    details:
      "Complete comprehensive mock interviews, receive a structured performance scorecard, and get a personalized roadmap to confidently navigate interviews and accelerate your career growth.",
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
        There are 10 modules :
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
