"use client";

import React from "react";
import { Star, Award, Users } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface ReviewItem {
  initials: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

interface CourseReviewsProps {
  course: Course;
  reviews: ReviewItem[];
  studentsAlsoBought: Course[];
  formatRupiah: (val: number) => string;
  renderStars: (rating: number, size?: number) => React.ReactNode;
  onCourseClick: (id: number) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function CourseReviews({
  course,
  reviews,
  studentsAlsoBought,
  formatRupiah,
  renderStars,
  onCourseClick,
  showToast,
}: CourseReviewsProps) {
  return (
    <>
      {/* Section 6: Rekomendasi "Students also bought" */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Students also bought</h2>
        <div className="flex flex-col border border-white/10 rounded-2xl bg-white/[0.01] p-4 divide-y divide-white/5">
          {studentsAlsoBought.map((item) => {
            const isItemBestseller = item.rating >= 4.9;
            return (
              <div 
                key={item.id} 
                onClick={() => onCourseClick(item.id)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3.5 cursor-pointer group select-none transition-all first:pt-1 last:pb-1"
              >
                {/* Left Thumbnail + Middle Info */}
                <div className="flex gap-4 items-start flex-grow min-w-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="min-w-0 flex-grow">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#DDA5FF] transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-white/50 font-medium">
                      {isItemBestseller ? (
                        <span className="font-extrabold uppercase bg-amber-400/10 text-[#FAEB92] border border-[#FAEB92]/30 px-1 py-0.5 rounded text-[8px] tracking-wide shrink-0">
                          Bestseller
                        </span>
                      ) : (
                        <span className="font-extrabold uppercase bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/30 px-1 py-0.5 rounded text-[8px] tracking-wide shrink-0">
                          Premium
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 font-bold text-[#FAEB92]">
                        <span>{item.rating.toFixed(1)}</span>
                        <Star className="size-2.5 fill-[#FAEB92] stroke-[#FAEB92]" />
                      </div>
                      <span>• {item.duration}</span>
                      <span>• Updated 6/2026</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing Section */}
                <div className="flex items-center gap-4 shrink-0 sm:pl-4 sm:border-l border-white/10 h-10 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-white">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 7: Ulasan Pengguna */}
      <div className="border-t border-white/5 pt-8 mb-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5 text-white">
          <Star className="size-5.5 fill-[#FAEB92] stroke-[#FAEB92]" />
          <span>{course.rating.toFixed(1)} course rating • {course.reviewsCount * 50} ratings</span>
        </h2>
        
        {/* 1. Mobile View: Horizontal Scroll */}
        <div 
          className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar lg:hidden w-full"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="snap-center shrink-0 w-[85vw] max-w-[300px] border border-white/10 bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all select-none"
            >
              <div>
                {/* User Profile Info */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B] to-[#892CDC] flex items-center justify-center text-xs font-bold text-white uppercase select-none border border-white/10 shrink-0">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{rev.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-2.5 ${
                              i < rev.rating
                                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                                : "fill-white/10 stroke-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-white/40 font-medium">{rev.date}</span>
                    </div>
                  </div>
                </div>
                
                {/* User Review Text */}
                <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-4">
                  {rev.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show All Reviews Button (Mobile Only) */}
        <div className="block lg:hidden mt-2 mb-6 w-full">
          <button 
            onClick={() => showToast("Simulasi membuka seluruh ulasan kursus", "info")}
            className="w-full py-3 rounded-xl border border-[#892CDC] text-[#DDA5FF] text-xs font-bold bg-transparent hover:bg-[#892CDC]/5 transition-all outline-none cursor-pointer"
          >
            Show all reviews
          </button>
        </div>

        {/* 2. Desktop View: Standard Grid 2x2 */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="border border-white/5 bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between h-full hover:border-white/10 transition-colors">
              <div>
                {/* User Profile Info */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B] to-[#892CDC] flex items-center justify-center text-xs font-bold text-white uppercase select-none border border-white/10 shrink-0">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-none">{rev.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-2.5 ${
                              i < rev.rating
                                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                                : "fill-white/10 stroke-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/40 font-medium">{rev.date}</span>
                    </div>
                  </div>
                </div>
                
                {/* User Review Text */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                  {rev.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTOR PROFILE */}
      <div className="border-t border-white/5 pt-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Pengajar / Instruktur</h2>
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left bg-white/[0.01] border border-white/5 rounded-2xl p-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A156E3] to-[#892CDC] flex items-center justify-center text-xl font-bold border-2 border-white/10 shrink-0 select-none">
            BS
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-0.5">ByteStart Team</h3>
            <p className="text-xs text-[#DDA5FF] font-medium mb-3">Pusat Pendidikan Pemrograman Terpadu</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-white/50 mb-3.5 font-medium">
              <div className="flex items-center gap-1">
                <Star className="size-3 text-[#FAEB92] fill-[#FAEB92]" />
                <span>4.8 Rating Instruktur</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="size-3 text-[#FAEB92]" />
                <span>12+ Kursus Aktif</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="size-3 text-[#FAEB92]" />
                <span>85,290+ Siswa Belajar</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              ByteStart adalah tim insinyur perangkat lunak senior, perancang UI/UX berpengalaman, dan pendidik teknologi
              yang berdedikasi tinggi untuk memberikan materi pembelajaran pemrograman terbaik, modular, praktis, dan siap industri.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
