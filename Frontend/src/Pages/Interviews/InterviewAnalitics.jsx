import React from "react";

const CompetitiveAnalysisCard = () => {
  return (
    <div
      className="max-w-8xl w-full min-h-[580px] bg-white/40 backdrop-blur-xl shadow-xl border border-white/40 p-6 md:p-20"
      style={{
        background:
          "radial-gradient(circle, #F0FAFF 0%, #A7DDF3 40%, #6BB2D6 70%, #3A80A8 100%)",
      }}
    >
      <div className="bg-transparent shadow-[0_24px_55px_rgba(15,23,42,0.35)] p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
          Competitive analysis
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] md:text-base text-left table-fixed text-black border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-1/4 border-b border-black pb-3 pr-4 border-r font-semibold">
                  Parameters
                </th>
                <th className="w-1/4 border-b border-black pb-3 px-4 border-r font-semibold">
                  Ordinary Companies
                </th>
                <th className="w-1/2 border-b border-black pb-3 pl-4 font-semibold">
                  Graphura Interview Preparation Program
                </th>
              </tr>
            </thead>

            <tbody className="align-top">
              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Training Mode
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Pre-recorded videos
                </td>
                <td className="py-4 pl-4">
                  Live interactive training
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Personal Mentorship
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Not provided
                </td>
                <td className="py-4 pl-4">
                  One-on-one career guidance
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Interview Practice
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Rare / extra paid
                </td>
                <td className="py-4 pl-4">
                  Live mock interviews included
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Guidance
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Generic advice
                </td>
                <td className="py-4 pl-4">
                  Domain-wise expert guidance
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Doubt Solving
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Delayed support
                </td>
                <td className="py-4 pl-4">
                  Instant live doubt solving
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Practical Learning
                </td>
                <td className="py-4 px-4 border-r border-black">
                  Only theory
                </td>
                <td className="py-4 pl-4">
                  Real case studies &amp; practice
                </td>
              </tr>

              <tr>
                <td className="py-4 pr-4 font-semibold border-r border-black">
                  Price
                </td>
                <td className="py-4 px-4 border-r border-black">
                  ₹3,000 – ₹8,000
                </td>
                <td className="py-4 pl-4 font-semibold">
                  ₹1,299 only
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysisCard;
