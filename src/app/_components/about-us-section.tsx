"use client";

import React from "react";

export function AboutUsSection() {
  return (
    <div id="about" className="bg-[#FFFDF4] text-black w-full py-24 md:py-32 px-6 lg:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Belief Statement Callout */}
        <div className="max-w-[920px]">
          <p className="text-3xl sm:text-[50px] lg:text-[61px] font-poppins font-semibold leading-[1.3] text-black tracking-tight">
            At ByteStart — we believe that <span className="italic font-normal">learning</span> to code should be <span className="font-poppins text-[#892CDC] text-4xl sm:text-6xl lg:text-7xl font-black italic">fun</span>, <span className="italic font-medium text-slate-800">accessible</span>, and actually <span className="font-poppins font-black uppercase text-[#892CDC] text-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">useful</span> — feel less intimidating and more like an adventure.
          </p>
        </div>

        {/* About us description grid */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pt-8 border-t border-black/10">
          <h2 className="text-3xl sm:text-[36px] font-normal tracking-tight font-poppins">
            about us
          </h2>
          <div className="max-w-[487px] space-y-6">
            <p className="text-[16px] text-black/75 leading-relaxed">
              We combine creativity and technology to deliver result that not only meet expectation but exceed them.
            </p>
            <a href="#courses" className="inline-block text-xl sm:text-[27px] font-normal border-b border-black hover:text-[#753795] hover:border-[#753795] transition-colors pb-0.5">
              Learn More
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
