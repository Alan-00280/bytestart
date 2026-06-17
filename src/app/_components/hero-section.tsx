"use client";

import React from "react";
import Link from "next/link";
import { ButtonGlass } from "@/components/ui/button-glass";

export function HeroSection() {
  return (
    <div 
      id="hero-wrapper"
      className="relative w-full bg-black pb-24 md:pb-32 px-6 lg:px-24 overflow-hidden bg-cover bg-no-repeat"
      style={{ 
        backgroundImage: "url('/images/landing/gradiasi-putih-purple.svg')"
      }}
    >
      <style>{`
        #hero-wrapper {
          background-position: center 225px;
        }
        @media (min-width: 768px) {
          #hero-wrapper {
            background-position: center -275px;
          }
        }
      `}</style>
      {/* Hero Section Container */}
      <div className="relative z-10 max-w-7xl mx-auto pt-12 md:pt-20">

        {/* Main Title & Subtitle Flex Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-between py-12">
          <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-poppins font-normal text-white leading-[1.15] tracking-tight max-w-[680px]">
            Learn <span className="italic">Smarter</span> Grow Faster with <span className="font-bold">ByteStart</span>
          </h1>
          <div className="lg:max-w-[320px] lg:pt-6">
            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed lg:text-right">
              Interactive courses, expert instructors, and seamless learning experience - designed to help you succeed.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-5 py-6">
          <ButtonGlass themeType="default" className="px-8 h-[43px]" asChild>
            <Link href="/courses" scroll={false}>Start Learning Now</Link>
          </ButtonGlass>
          <ButtonGlass themeType="outline" logoRight className="px-[30px] h-[43px]" asChild>
            <Link href="/courses" scroll={false}>Explore Course</Link>
          </ButtonGlass>
        </div>

        {/* Stats Capsule / Dashboard Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-16 border-t border-white/10 mt-16">
          <span className="text-sm font-normal uppercase tracking-wider text-white/55">
            see our portfolio
          </span>

          {/* Purple Stats Capsule */}
          <div className="bg-[#3A125C] border border-white/10 rounded-[110px] py-4 px-5 sm:py-[20px] sm:px-[89px] flex items-center justify-center gap-5 sm:gap-[67px] shadow-2xl">
            <div className="text-center">
              <span className="block font-bold text-2xl sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                80K+
              </span>
              <span className="text-[10px] sm:text-[16px] font-normal text-white/80 mt-1 block">
                Students
              </span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-2xl sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                10K+
              </span>
              <span className="text-[10px] sm:text-[16px] font-normal text-white/80 mt-1 block">
                Course
              </span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-2xl sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                98%
              </span>
              <span className="text-[10px] sm:text-[16px] font-normal text-white/80 mt-1 block">
                Success Rate
              </span>
            </div>
          </div>

          <span className="text-sm font-normal uppercase tracking-wider text-white/55 animate-bounce">
            scroll now
          </span>
        </div>

      </div>
    </div>
  );
}
