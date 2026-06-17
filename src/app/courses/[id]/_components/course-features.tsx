"use client";

import React from "react";
import { Star, Check, ChevronDown, ChevronUp, PlayCircle, FileText, Download, Smartphone, Award, Key } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface CourseFeaturesProps {
  course: Course;
  learnItems: string[];
  relatedTopics: string[];
  showAllLearn: boolean;
  setShowAllLearn: (val: boolean) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function CourseFeatures({
  course,
  learnItems,
  relatedTopics,
  showAllLearn,
  setShowAllLearn,
  showToast,
}: CourseFeaturesProps) {
  return (
    <>
      {/* Section 1: Topik Terkait (Explore Related Topics) */}
      <div>
        <h4 className="font-bold text-lg text-white mb-3">Explore related topics</h4>
        <div className="flex flex-wrap gap-3">
          {relatedTopics.map((topic, i) => (
            <button 
              key={i} 
              onClick={() => showToast(`Mencari topik: ${topic}`, "info")}
              className="text-xs px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-white/80 hover:bg-[#892CDC]/10 hover:border-[#892CDC]/50 hover:text-white transition-all cursor-pointer outline-none active:scale-95"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: "What you'll learn" & "Premium Plan Offer" */}
      <div className="border border-white/10 bg-white/[0.01] rounded-2xl overflow-hidden shadow-xl">
        {/* Premium Plan Offer Banner (Top of Box) */}
        <div className="bg-[#1a0a2a] border-b border-white/10 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#A156E3] to-[#892CDC] text-white px-2.5 py-1 rounded shrink-0">
              Premium
            </span>
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              Access 28,000+ top-rated courses with ByteStart Personal Plan.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-[#FAEB92]">
            <Star className="size-3.5 fill-[#FAEB92] stroke-[#FAEB92]" />
            <span>4.9/5.0</span>
            <span className="text-white/40 font-normal text-[10px]">(Personal Plan)</span>
          </div>
        </div>

        {/* What You'll Learn Content (Bottom of Box) */}
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 text-white">What you'll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learnItems
              .slice(0, showAllLearn ? learnItems.length : 4)
              .map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <Check className="size-4.5 text-[#A156E3] shrink-0 mt-0.5 border border-[#892CDC]/25 bg-[#892CDC]/10 rounded-full p-0.5" />
                  <span className="text-xs sm:text-sm text-white/70 leading-relaxed">{item}</span>
                </div>
              ))}
          </div>
          {learnItems.length > 4 && (
            <button 
              onClick={() => setShowAllLearn(!showAllLearn)}
              className="mt-4 flex items-center gap-1 text-xs text-[#A156E3] hover:text-[#b46af2] font-semibold cursor-pointer outline-none bg-transparent border-none"
            >
              <span>{showAllLearn ? "Show less" : "Show more"}</span>
              {showAllLearn ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Section 3: Fasilitas Kursus (This course includes) */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">This course includes:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <PlayCircle className="size-4.5 text-[#A156E3] shrink-0" />
            <span>{course.duration} video sesuai permintaan (on-demand)</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <FileText className="size-4.5 text-[#A156E3] shrink-0" />
            <span>12 Artikel pendukung</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <Download className="size-4.5 text-[#A156E3] shrink-0" />
            <span>18 Sumber daya yang dapat diunduh (resources)</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <Smartphone className="size-4.5 text-[#A156E3] shrink-0" />
            <span>Akses di perangkat seluler dan TV</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <Award className="size-4.5 text-[#A156E3] shrink-0" />
            <span>Sertifikat penyelesaian setelah lulus</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
            <Key className="size-4.5 text-[#A156E3] shrink-0" />
            <span>Akses penuh seumur hidup</span>
          </div>
        </div>
      </div>
    </>
  );
}
