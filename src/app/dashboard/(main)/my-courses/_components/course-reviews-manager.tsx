"use client";

import React from "react";
import { Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  time: string;
  body: string;
}

interface CourseReviewsManagerProps {
  reviews: Review[];
  onDeleteReview: (id: string) => void;
}

export function CourseReviewsManager({
  reviews,
  onDeleteReview,
}: CourseReviewsManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Student Reviews Board</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Read and manage ratings submitted by students.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <span className="text-xs text-slate-500">No ratings submitted for this course yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between relative group"
            >
              <button
                onClick={() => onDeleteReview(rev.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-transparent border-none outline-none"
                title="Remove Review"
              >
                <Trash2 className="size-4" />
              </button>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-bold uppercase select-none">
                    {rev.avatar || rev.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{rev.user}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i < rev.rating
                                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                                : "fill-white/10 stroke-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium">{rev.time}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {rev.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
