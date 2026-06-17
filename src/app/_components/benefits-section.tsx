"use client";

import React from "react";

const benefits = [
  {
    title: "Built by Professionals",
    description: "Get the best experience knowing that our courses are designed and vetted by industry veterans."
  },
  {
    title: "Interactive Labs",
    description: "Write, run, and test code directly in your browser with our built-in workspace editor."
  },
  {
    title: "Real-world Projects",
    description: "Build portfolio-ready applications that demonstrate actual engineering competence."
  },
  {
    title: "Community Access",
    description: "Join our active Discord server to network with thousands of fellow developers."
  },
  {
    title: "Lifetime Updates",
    description: "Purchase once and get free access to all future course updates as technologies evolve."
  },
  {
    title: "Career Support",
    description: "Access our exclusive resume templates, interview prep guides, and job referrals."
  }
];

export function BenefitsSection() {
  return (
    <div id="benefits" className="bg-[#FFFDF4] text-black w-full py-16 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
            Key Benefits of Courses
          </h2>
          <p className="text-[16px] text-black/75 leading-relaxed">
            From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-16">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="bg-white rounded-[26px] p-8 h-[200px] flex flex-col justify-center border border-black/5 shadow-[19px_23px_75px_-5px_rgba(0,0,0,0.08)] hover:border-[#753795]/20 transition-all duration-300"
            >
              <h3 className="font-poppins font-semibold text-[22px] text-black mb-3">
                {benefit.title}
              </h3>
              <p className="text-[15px] text-black/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
