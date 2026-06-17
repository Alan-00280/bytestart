"use client";

import React from "react";
import { Star, Search, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";

interface ReviewItem {
  id: string;
  avatar: string;
  user: string;
  rating: number;
  time: string;
  body: string;
  helpfulState: "up" | "down" | null;
}

interface ReviewsTabProps {
  studentReviewsList: ReviewItem[];
  onVoteReview: (revId: string, type: "up" | "down") => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function ReviewsTab({ studentReviewsList, onVoteReview, showToast }: ReviewsTabProps) {
  return (
    <div className="max-w-4xl text-slate-300 space-y-6">
      {/* 🌟 Section 1: Ringkasan Nilai Kursus (Student Feedback Breakdown) */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-8 pt-4">
        {/* Sisi Kiri (Big Rating Display) */}
        <div className="text-center md:border-r border-slate-800 md:pr-10 flex flex-col items-center justify-center shrink-0">
          <span className="text-5xl font-black text-[#FAEB92] mb-2">4.7</span>
          <div className="flex gap-0.5 my-1.5 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="size-4 fill-[#FAEB92] stroke-[#FAEB92]" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 mt-1">Course Rating</span>
        </div>

        {/* Sisi Ranan (Distribution Progress Bars - Flex-1) */}
        <div className="flex-1 w-full flex flex-col justify-center space-y-2 text-xs">
          {[
            { stars: 5, pct: 70 },
            { stars: 4, pct: 24 },
            { stars: 3, pct: 4 },
            { stars: 2, pct: 1 },
            { stars: 1, pct: 1 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-4">
              {/* Linear Bar */}
              <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#892CDC] h-full rounded-full transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              {/* Stars Indicator */}
              <div className="flex items-center gap-0.5 shrink-0 w-[72px] justify-end">
                {Array.from({ length: 5 }).map((_, sIdx) => (
                  <Star
                    key={sIdx}
                    className={`size-3 ${
                      sIdx < row.stars ? "fill-[#FAEB92] stroke-[#FAEB92]" : "text-slate-700 fill-transparent"
                    }`}
                  />
                ))}
              </div>
              {/* Percentage Link */}
              <button
                onClick={() => showToast(`Menyaring ulasan bintang ${row.stars}...`, "info")}
                className="w-10 text-right font-mono font-bold text-[#892CDC] hover:text-purple-400 transition cursor-pointer bg-transparent border-none p-0 outline-none text-xs"
              >
                {row.pct}%
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Section 2: Search Reviews & Filter Control Bar (Middle Area 1) */}
      <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 w-full">
        {/* Search Input & Button Row */}
        <div className="flex gap-0 items-center w-full max-w-xl">
          <input
            type="text"
            placeholder="Search reviews"
            className="flex-1 bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#892CDC]/50 transition-colors"
          />
          <button
            onClick={() => showToast("Mencari ulasan...", "info")}
            className="w-10 bg-[#892CDC] hover:bg-[#973fe8] rounded-r-xl flex items-center justify-center border-none text-white cursor-pointer active:scale-95 transition-all outline-none aspect-square shrink-0"
          >
            <Search className="size-4" />
          </button>
        </div>

        {/* Dropdown Filter Container */}
        <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Filter ratings</span>
          <div className="relative flex items-center">
            <select
              defaultValue="all"
              className="appearance-none bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:border-[#892CDC]/50 text-xs text-slate-300 font-medium cursor-pointer w-full"
            >
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <ChevronDown className="size-3 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 🌟 Section 3: Student Reviews Feed (Main Content Area) */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-white mb-6">Reviews</h3>

        <div className="space-y-6">
          {studentReviewsList.map((rev) => (
            <div key={rev.id} className="flex gap-4 items-start border-b border-slate-800 pb-8 last:border-b-0">
              {/* Sisi Kiri (User Initial Avatar) */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B]/60 to-[#892CDC]/80 text-white font-poppins font-bold text-xs flex items-center justify-center shrink-0 border border-[#892CDC]/30 shadow-inner select-none">
                {rev.avatar}
              </div>

              {/* Sisi Ranan (Review Detail Content - Flex-1) */}
              <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-white">{rev.user}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`size-3.5 ${
                          idx < rev.rating ? "fill-[#FAEB92] stroke-[#FAEB92]" : "text-slate-700 fill-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-light ml-auto">{rev.time}</span>
                </div>

                {/* Message Paragraph */}
                <p className="text-sm text-slate-300 my-3 leading-relaxed">{rev.body}</p>

                {/* Helpful Interaction Buttons */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="text-slate-500">Was this review helpful?</span>

                  {/* ThumbsUp Button */}
                  <button
                    onClick={() => onVoteReview(rev.id, "up")}
                    className={`p-1.5 rounded-full border border-slate-800 hover:border-[#892CDC] hover:bg-[#892CDC]/10 transition cursor-pointer bg-transparent outline-none flex items-center justify-center ${
                      rev.helpfulState === "up" ? "bg-[#892CDC]/25 border-[#892CDC] text-[#DDA5FF]" : "text-slate-500"
                    }`}
                    title="Yes"
                  >
                    <ThumbsUp className="size-3.5" />
                  </button>

                  {/* ThumbsDown Button */}
                  <button
                    onClick={() => onVoteReview(rev.id, "down")}
                    className={`p-1.5 rounded-full border border-slate-800 hover:border-red-400 hover:bg-red-500/10 transition cursor-pointer bg-transparent outline-none flex items-center justify-center ${
                      rev.helpfulState === "down" ? "bg-red-500/25 border-red-500 text-red-400" : "text-slate-500"
                    }`}
                    title="No"
                  >
                    <ThumbsDown className="size-3.5" />
                  </button>

                  {/* Report Text Link */}
                  <button
                    onClick={() => showToast("Ulasan dilaporkan", "info")}
                    className="text-xs font-bold text-slate-400 hover:text-purple-400 transition cursor-pointer bg-transparent border-none p-0 outline-none ml-2"
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Section 4: Pagination Trigger (Bottom Area) */}
      <div className="pt-2">
        <button
          onClick={() => showToast("Memuat lebih banyak ulasan...", "info")}
          className="w-full py-2.5 rounded-xl border border-purple-500/30 text-center text-sm font-bold text-white hover:bg-purple-600/10 transition cursor-pointer bg-transparent outline-none active:scale-95"
        >
          See more reviews
        </button>
      </div>
    </div>
  );
}
