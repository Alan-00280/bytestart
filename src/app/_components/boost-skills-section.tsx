"use client";

import React from "react";
import { Clock, BookOpen, Users } from "lucide-react";

export function BoostSkillsSection() {
  return (
    <div className="bg-[#FFFDF4] text-black w-full pb-20 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
            Boost Your Skills
          </h2>
          <p className="text-[16px] text-black/75 leading-relaxed">
            From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
          </p>
        </div>

        {/* 3 cards row */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-16">

          {/* Card 1 */}
          <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
              <Clock className="w-16 h-16 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">100+</span>
              <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                Hours of Content
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
              <BookOpen className="w-16 h-16 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">15+</span>
              <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                COURSES
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
              <Users className="w-16 h-16 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">20K+</span>
              <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                STUDENTS
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
