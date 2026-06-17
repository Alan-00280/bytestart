"use client";

import React from "react";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface SyllabusLesson {
  title: string;
  duration: string;
}

interface SyllabusSection {
  title: string;
  lessons: SyllabusLesson[];
}

interface CourseCurriculumProps {
  course: Course;
  syllabus: SyllabusSection[];
  expandedSections: Record<number, boolean>;
  onToggleSection: (idx: number) => void;
  onToggleAllSections: (totalSections: number) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function CourseCurriculum({
  course,
  syllabus,
  expandedSections,
  onToggleSection,
  onToggleAllSections,
  showToast,
}: CourseCurriculumProps) {
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-bold">Course content</h2>
          <p className="text-xs text-white/40 mt-1">
            {syllabus.length} Section • {course.lessons} Materi Kuliah • {course.duration} Total Durasi
          </p>
        </div>
        <button 
          onClick={() => onToggleAllSections(syllabus.length)}
          className="text-xs text-[#A156E3] hover:text-[#b46af2] font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
        >
          {Object.keys(expandedSections).length === syllabus.length ? "Collapse all sections" : "Expand all sections"}
        </button>
      </div>

      {/* Syllabus Accordion list */}
      <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10 bg-white/[0.01]">
        {syllabus.map((section, idx) => {
          const isOpen = !!expandedSections[idx];
          return (
            <div key={idx} className="transition-all duration-300">
              {/* Section Header Accordion */}
              <button
                onClick={() => onToggleSection(idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-all cursor-pointer bg-transparent border-none outline-none"
              >
                <div className="flex items-center gap-3 pr-4">
                  {isOpen ? (
                    <ChevronUp className="size-4.5 text-[#A156E3] shrink-0" />
                  ) : (
                    <ChevronDown className="size-4.5 text-[#A156E3] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-slate-100">
                    {section.title}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 shrink-0 font-medium ml-4">
                  {section.lessons.length} lectures • {section.lessons.reduce((acc, curr) => acc + parseInt(curr.duration), 0)}m
                </span>
              </button>

              {/* Section Content Accordion */}
              {isOpen && (
                <div className="bg-[#150a22]/30 py-2 border-t border-white/5 animate-in fade-in duration-200">
                  {section.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] text-xs">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="size-4 text-white/40 fill-white/5 shrink-0" />
                        <span className="text-white/80 hover:text-[#DDA5FF] cursor-pointer transition-colors font-medium">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {lIdx === 0 && (
                          <button 
                            onClick={() => showToast(`Memutar video pratinjau gratis: ${lesson.title}`, "info")}
                            className="text-[10px] text-[#A156E3] hover:underline font-semibold bg-transparent border-none cursor-pointer outline-none shrink-0"
                          >
                            Preview
                          </button>
                        )}
                        <span className="text-white/40 text-[10px] font-medium min-w-[32px] text-right">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
