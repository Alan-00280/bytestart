"use client";

import React from "react";
import { Star } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface CourseStickyHeaderProps {
  course: Course;
  currentPrice: number;
  isScrolled: boolean;
  renderStars: (rating: number, size?: number) => React.ReactNode;
  formatRupiah: (val: number) => string;
  onBuyNow: () => void;
}

export function CourseStickyHeader({
  course,
  currentPrice,
  isScrolled,
  renderStars,
  formatRupiah,
  onBuyNow,
}: CourseStickyHeaderProps) {
  return (
    <div 
      className={`fixed top-0 left-0 w-full h-14 bg-slate-950/95 backdrop-blur-md z-50 border-b border-white/10 flex items-center shadow-lg transition-all duration-300 transform ${
        isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 pr-4">
          <span className="font-poppins font-bold text-sm text-slate-100 truncate max-w-[200px] sm:max-w-[400px]">
            {course.title}
          </span>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-[#FAEB92] mt-0.5">{course.rating.toFixed(1)}</span>
            {renderStars(course.rating, 3.5)}
            <span className="text-[10px] text-[#A156E3] font-medium hover:underline cursor-pointer">
              ({course.reviewsCount} rating)
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] text-white/40 shrink-0">
            | {course.reviewsCount * 4} Siswa
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-sm font-bold text-[#DDA5FF] block">
              {formatRupiah(currentPrice)}
            </span>
          </div>
          <button 
            onClick={onBuyNow}
            className="bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold py-2 px-4 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
