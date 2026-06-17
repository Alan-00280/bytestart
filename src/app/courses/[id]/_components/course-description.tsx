"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface CourseDescriptionProps {
  course: Course;
  requirements: string[];
  showMoreDesc: boolean;
  setShowMoreDesc: (val: boolean) => void;
}

export function CourseDescription({
  course,
  requirements,
  showMoreDesc,
  setShowMoreDesc,
}: CourseDescriptionProps) {
  return (
    <div>
      {/* Requirements */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-white">Requirements</h2>
        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-white/70">
          {requirements.map((req, idx) => (
            <li key={idx} className="marker:text-[#A156E3] leading-relaxed">
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-white">Description</h2>
        <div 
          className={`text-xs sm:text-sm text-white/70 space-y-4 leading-relaxed font-light transition-all ${
            showMoreDesc ? "" : "max-h-[140px] overflow-hidden relative"
          }`}
        >
          <p>
            Apakah Anda ingin meningkatkan jenjang karir Anda atau ingin meluncurkan produk aplikasi mandiri?
            Kelas <strong className="text-white">{course.title}</strong> dirancang secara khusus untuk membimbing Anda
            dari dasar pemula hingga tingkat mahir dengan pemahaman mendalam secara praktikal.
          </p>
          <p>
            Kami menyusun kurikulum ini bersama para ahli industri teknologi untuk memastikan materi yang diajarkan
            selalu relevan dengan kebutuhan pasar modern tahun 2026. Anda tidak hanya akan mendengarkan teori,
            namun langsung membangun portofolio proyek berkualitas produksi yang siap dipamerkan pada calon pemberi kerja.
          </p>
          <p>
            Setiap bab dilengkapi dengan latihan kuis, tantangan koding mandiri, serta diskusi grup eksklusif bersama
            mentor berpengalaman. Bergabunglah dengan ribuan murid lainnya dan mulai langkah kesuksesan digital Anda bersama ByteStart hari ini!
          </p>
          {!showMoreDesc && (
            <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-[#0b0314] to-transparent pointer-events-none" />
          )}
        </div>
        <button 
          onClick={() => setShowMoreDesc(!showMoreDesc)}
          className="mt-3 flex items-center gap-1 text-xs text-[#A156E3] hover:text-[#b46af2] font-semibold cursor-pointer outline-none bg-transparent border-none"
        >
          <span>{showMoreDesc ? "Show less" : "Show more"}</span>
          {showMoreDesc ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
