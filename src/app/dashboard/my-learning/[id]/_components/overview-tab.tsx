"use client";

import React from "react";
import { Star, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface OverviewTabProps {
  course: Course;
  courseCompletionRate: number;
  showSchedulerWidget: boolean;
  setShowSchedulerWidget: (show: boolean) => void;
  showFullDescription: boolean;
  setShowFullDescription: (show: boolean) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function OverviewTab({
  course,
  courseCompletionRate,
  showSchedulerWidget,
  setShowSchedulerWidget,
  showFullDescription,
  setShowFullDescription,
  showToast,
}: OverviewTabProps) {
  return (
    <div className="max-w-4xl text-slate-300 space-y-2">
      {/* Course Metadata Header */}
      <div className="pb-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold font-poppins text-white leading-tight mb-3">
          {course.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Level */}
          <span className="bg-[#892CDC]/15 border border-[#892CDC]/25 text-[#DDA5FF] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
            {course.level}
          </span>

          {/* Star ratings */}
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-[#FAEB92] stroke-[#FAEB92]" />
            <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
            <span className="text-slate-500 font-light">({course.reviewsCount} reviews)</span>
          </div>

          <div className="text-slate-500">•</div>

          <div className="flex items-center gap-1 font-mono text-slate-400">
            <Clock className="size-3.5 text-slate-500" />
            <span>{course.duration} total duration</span>
          </div>

          <div className="text-slate-500">•</div>

          <div className="text-slate-300">
            Progress: <span className="font-bold text-[#FAEB92]">{courseCompletionRate}% Completed</span>
          </div>
        </div>
      </div>

      {/* 🌟 Section 1: Widget Jadwal Belajar ("Schedule learning time") */}
      {showSchedulerWidget && (
        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/10 mt-6 relative overflow-hidden flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#892CDC]/10 border border-[#892CDC]/25 text-[#DDA5FF] flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-white font-poppins">Schedule learning time</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed max-w-3xl">
                Learning a little each day adds up. Research shows that students who make learning a habit are more
                likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1 sm:pl-14">
            <button
              onClick={() => showToast("Membuka setelan jadwal belajar (Simulasi)", "success")}
              className="px-5 py-2 h-9 rounded-xl border border-[#892CDC] hover:bg-[#892CDC]/15 text-xs font-bold text-white transition-all cursor-pointer outline-none bg-transparent active:scale-95"
            >
              Get started
            </button>
            <button
              onClick={() => {
                setShowSchedulerWidget(false);
                showToast("Widget jadwal belajar disembunyikan", "info");
              }}
              className="px-4 py-2 h-9 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-none outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 🌟 Section 2: Statistik Kursus (By the numbers) */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800">
        <div className="text-sm text-slate-400 font-medium w-32 shrink-0">By the numbers</div>
        <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-2.5 text-sm text-slate-200">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Skill level: All Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Students: 158749</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Languages: English</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Captions: Yes</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Lectures: 452</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Video: 40.5 total hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Section 3: Sertifikat Kelulusan (Certificates) */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800 items-start sm:items-center">
        <div className="text-sm text-slate-400 font-medium w-32 shrink-0">Certificates</div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-slate-300 font-light">
            Get ByteStart certificate by completing entire course
          </p>
          <button
            onClick={() => {
              if (courseCompletionRate === 100) {
                showToast("Mengunduh sertifikat resmi ByteStart...", "success");
              } else {
                showToast(
                  `Progres Anda masih ${courseCompletionRate}%. Selesaikan seluruh video untuk membuka sertifikat.`,
                  "info",
                );
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-300 hover:text-[#892CDC] hover:border-[#892CDC]/50 bg-transparent transition-all cursor-pointer outline-none active:scale-95"
          >
            ByteStart certificate
          </button>
        </div>
      </div>

      {/* 🌟 Section 4: Akses Fitur (Features) */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800 items-start sm:items-center">
        <div className="text-sm text-slate-400 font-medium w-32 shrink-0">Features</div>
        <div className="flex-1 text-sm text-slate-300">
          <span>Available on </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast("Mengalihkan ke App Store iOS (Simulasi)", "info");
            }}
            className="text-[#892CDC] underline hover:text-[#973fe8] font-semibold transition-colors decoration-slate-700"
          >
            iOS
          </a>
          <span> and </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast("Mengalihkan ke Play Store Android (Simulasi)", "info");
            }}
            className="text-[#892CDC] underline hover:text-[#973fe8] font-semibold transition-colors decoration-slate-700"
          >
            Android
          </a>
        </div>
      </div>

      {/* 🌟 Section 5: Deskripsi Detail Materi (Description) */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 items-start">
        <div className="text-sm text-slate-400 font-medium w-32 shrink-0">Description</div>
        <div className="flex-1 space-y-4">
          <div className="text-sm text-slate-400 font-light leading-relaxed space-y-3">
            <p>
              Welcome to this comprehensive course designed for developers of all skill levels. In this masterclass, we
              will study the <strong>latest version of Next.js</strong>, diving deep into advanced architectures like
              server-side rendering, static site generation, and state management frameworks.
            </p>

            {showFullDescription ? (
              <div className="space-y-3 animate-in fade-in duration-300">
                <p>
                  We will explore everything from setting up dynamic routing in the new <strong>App Router</strong> to
                  migrating older systems built using the legacy <strong>Pages Router</strong>. You will also learn how
                  to configure Tailwind CSS v4, utilize React Server Actions, and build fully production-ready apps with
                  high-fidelity UI components.
                </p>
                <p>
                  This course includes practical code labs, real-world checkout integrations, personal notes, and direct
                  access to ZIP files for each module. Selesaikan seluruh silabus untuk membuka sertifikat digital resmi
                  Anda.
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic">...</p>
            )}
          </div>

          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs font-bold text-[#892CDC] hover:text-[#973fe8] inline-flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none mt-2 transition-all active:scale-95"
          >
            <span>{showFullDescription ? "Show less" : "Show more"}</span>
            {showFullDescription ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
