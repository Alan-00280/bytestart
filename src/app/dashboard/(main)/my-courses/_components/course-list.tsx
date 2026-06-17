"use client";

import React, { useMemo } from "react";
import { Plus, Edit, Trash2, Clock, BookOpen, Star, Layers, Users, DollarSign } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface CourseListProps {
  courses: Course[];
  onCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: number, title: string) => void;
  formatRupiah: (val: number) => string;
}

export function CourseList({
  courses,
  onCreateCourse,
  onEditCourse,
  onDeleteCourse,
  formatRupiah,
}: CourseListProps) {
  // Generate metrics based on courses
  const metrics = useMemo(() => {
    const activeCount = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.reviewsCount * 12), 0);
    const estimatedRev = courses.reduce((acc, c) => acc + (c.price * c.reviewsCount * 6), 0);
    return { activeCount, totalStudents, estimatedRev };
  }, [courses]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Active Courses</span>
            <span className="text-3xl font-black text-white font-poppins">{metrics.activeCount}</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Layers className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Total Enrolled Students</span>
            <span className="text-3xl font-black text-white font-poppins">{metrics.totalStudents}</span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Users className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Estimated Revenue</span>
            <span className="text-3xl font-black text-[#FAEB92] font-poppins">{formatRupiah(metrics.estimatedRev)}</span>
          </div>
          <div className="p-3 bg-[#FAEB92]/10 rounded-xl border border-[#FAEB92]/20 text-[#FAEB92]">
            <DollarSign className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FAEB92]/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-poppins">Catalog Management</h3>
          <p className="text-xs text-slate-400 mt-1">Manage your active courses, curriculums, and student communities.</p>
        </div>
        <button
          onClick={onCreateCourse}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-amber-500/15 transition-all cursor-pointer border-none"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.slice(0, 9).map((course) => (
          <div 
            key={course.id} 
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/20 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            {/* Header Banner image */}
            <div className="w-full aspect-video relative overflow-hidden bg-slate-950">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                <span className="text-[9px] font-extrabold uppercase bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4.5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                  {course.category}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug group-hover:text-amber-300 transition-colors truncate max-w-full">
                  {course.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-light line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 font-semibold text-white">
                  <Clock className="size-3 text-amber-500" />
                  <span>{course.duration}</span>
                  <span className="text-slate-600">|</span>
                  <BookOpen className="size-3 text-amber-500" />
                  <span>{course.lessons} Materi</span>
                </div>

                <div className="flex items-center gap-0.5 font-bold text-[#FAEB92]">
                  <span>{course.rating.toFixed(1)}</span>
                  <Star className="size-3 fill-[#FAEB92] stroke-[#FAEB92]" />
                  <span className="text-slate-500 font-medium">({course.reviewsCount})</span>
                </div>
              </div>

              {/* Pricing and Actions */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 line-through leading-none">{formatRupiah(course.originalPrice)}</span>
                  <span className="text-sm font-black text-white leading-none mt-1">{formatRupiah(course.price)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all border border-white/10 hover:border-amber-500 cursor-pointer outline-none"
                    title="Edit Course Details"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id, course.title)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all border border-white/10 hover:border-red-500/30 cursor-pointer outline-none"
                    title="Delete Course"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.05] pt-6 mt-4 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">1-{Math.min(9, courses.length)}</span> of{" "}
          <span className="font-semibold text-white">{courses.length}</span> courses
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            disabled 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed text-[11px]"
          >
            Prev
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold border-none text-[11px]"
          >
            1
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            2
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            3
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
