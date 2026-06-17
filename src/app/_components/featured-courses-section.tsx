"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Framer Full Mastery & More 2024",
    description: "Master Framer in 2024 with this updated course. Learn to design, prototype, and build interactive websites.",
    price: "$999",
    rating: "4.9",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Next.js 15 & Tailwind v4 Pro",
    description: "Step into the future of frontend development. Build server-first, blindingly fast web applications.",
    price: "$899",
    rating: "5.0",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "UI/UX System Design Core",
    description: "Translate visual ideas into clean code. Master Figma layout principles, typography scales, and CSS frameworks.",
    price: "$799",
    rating: "4.8",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=80"
  }
];

export function FeaturedCoursesSection() {
  return (
    <div id="courses" className="bg-[#FFFDF4] text-black w-full py-16 pb-24 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
            Featured Courses
          </h2>
          <p className="text-[16px] text-black/75 leading-relaxed">
            From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
          </p>
        </div>

        {/* 3 course cards row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-[35px] p-6 w-full max-w-[400px] h-[510px] flex flex-col gap-4 shadow-[12px_25px_77px_20px_rgba(0,0,0,0.06)] border border-black/5 hover:-translate-y-2.5 transition-all duration-300"
            >
              {/* Course Banner */}
              <div className="h-[228px] rounded-[19px] bg-neutral-100 overflow-hidden relative border border-black/5">
                <img
                  alt={course.title}
                  className="w-full h-full object-cover"
                  src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Rating & Price */}
              <div className="flex items-center justify-between px-1 text-sm font-semibold text-black">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="size-4 fill-amber-500 stroke-amber-500" />
                  <span>{course.rating}</span>
                  <span className="text-black/40 font-normal text-xs">(480 ratings)</span>
                </div>
                <span className="text-lg font-bold text-[#753795]">{course.price}</span>
              </div>

              {/* Course Details */}
              <div className="space-y-2 flex-grow">
                <h3 className="font-poppins font-semibold text-[20px] text-black leading-tight">
                  {course.title}
                </h3>
                <p className="text-[14px] text-black/70 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              {/* Badge Tag */}
              <div className="pt-2">
                <span className="bg-[#EEE6F2] text-[#220234] text-xs font-semibold px-4 py-1.5 rounded-full inline-block">
                  {course.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <div className="text-center pt-8">
          <Link href="/courses" scroll={false} className="inline-flex items-center justify-center gap-2 bg-[#CB71F7]/25 hover:bg-[#CB71F7]/40 text-[#2D0344] font-semibold rounded-[30px] px-8 h-[45px] transition-all cursor-pointer shadow-lg shadow-black/10 border border-white/20 select-none">
            View Course
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8L16 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
