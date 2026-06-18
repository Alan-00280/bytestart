"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Users, Calendar, Globe } from "lucide-react";
import { Course, ownersData } from "@/data/coursesMock";

interface CourseHeroProps {
  course: Course;
  renderStars: (rating: number, size?: number) => React.ReactNode;
  isBestseller: boolean;
}

export function CourseHero({
  course,
  renderStars,
  isBestseller,
}: CourseHeroProps) {
  return (
    <section className="bg-slate-950/70 border-b border-white/5 py-12 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-[65%] pr-0 lg:pr-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4 font-medium">
            <Link href="/courses" className="hover:text-[#A156E3] transition-colors">Katalog</Link>
            <ChevronRight className="size-3" />
            <span className="text-[#DDA5FF] truncate">{course.category}</span>
          </div>

          {/* Bestseller Badge & Rating */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {isBestseller ? (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-400/15 text-[#FAEB92] border border-[#FAEB92]/30 px-2.5 py-0.5 rounded">
                Bestseller
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/30 px-2.5 py-0.5 rounded">
                Premium
              </span>
            )}
            <span className="bg-white/5 border border-white/10 text-xs px-2 py-0.5 rounded text-white/70">
              {course.level}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[#FAEB92]">{course.rating.toFixed(1)}</span>
              {renderStars(course.rating, 4)}
              <span className="text-xs text-[#A156E3] font-semibold hover:underline cursor-pointer ml-1">
                ({course.reviewsCount} rating)
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-poppins font-bold leading-tight mb-4 text-white">
            {course.title}
          </h1>
          <p className="text-sm sm:text-base text-white/75 mb-6 max-w-[680px] leading-relaxed">
            {course.description}
          </p>

          {/* Instructor & Metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs text-white/60 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#A156E3]" />
              <span>Dibuat oleh <span className="text-white font-medium">{ownersData[course.ownerId]?.name || "ByteStart Team"}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#A156E3]" />
              <span>Terakhir update <span className="text-white font-medium">Juni 2026</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-[#A156E3]" />
              <span>Bahasa <span className="text-white font-medium">Indonesia</span></span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
