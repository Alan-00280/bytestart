"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, Clock, BookOpen, ShoppingCart } from "lucide-react";
import { ButtonGlass } from "@/components/ui/button-glass";
import { Course, ownersData } from "@/data/coursesMock";

interface CourseCardProps {
  course: Course;
  onShowToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function CourseCard({ course, onShowToast }: CourseCardProps) {
  const router = useRouter();
  
  // Format currency Helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper to render mini stars for mobile view
  const renderMiniStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`size-2.5 ${
              i < Math.floor(rating)
                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                : "fill-white/10 stroke-white/10"
            }`}
          />
        ))}
      </div>
    );
  };

  const isBestseller = course.rating >= 4.9;

  return (
    <div
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-white/[0.02] border border-white/10 hover:border-[#A156E3]/20 lg:hover:-translate-y-1 rounded-[16px] lg:rounded-[24px] p-3.5 sm:p-4 lg:p-5 flex flex-row lg:flex-col gap-3.5 sm:gap-4 shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group select-none cursor-pointer h-full"
    >
      
      {/* 1. THUMBNAIL CONTAINER */}
      {/* Mobile: compact square, Desktop: aspect-video */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-full lg:h-auto lg:aspect-video rounded-xl overflow-hidden relative border border-white/5 bg-neutral-900 shrink-0 z-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
          }}
        />
        {/* Floating Difficulty Tag (Desktop Only) */}
        <span className="hidden lg:block absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold px-2 py-0.5 rounded-md text-white/80">
          {course.level}
        </span>
      </div>

      {/* 2. DETAILS WRAPPER */}
      {/* Takes remaining horizontal space in mobile, and structures vertically */}
      <div className="flex flex-col flex-grow justify-between lg:justify-start lg:gap-3.5 min-w-0">
        {/* Title & Instructor */}
        <div>
          <h3 className="font-poppins font-semibold text-xs sm:text-sm lg:text-base text-slate-100 lg:text-white leading-snug line-clamp-2 lg:group-hover:text-[#DDA5FF] transition-colors">
            {course.title}
          </h3>
          {/* Instructor (Displayed on both Desktop & Mobile) */}
          <span className="block text-[10px] text-white/40 mt-1">
            Oleh {ownersData[course.ownerId]?.name || "ByteStart Team"}
          </span>
        </div>

        {/* Category & Stats (Desktop) */}
        <div className="hidden lg:flex items-center justify-between text-[11px] text-white/50">
          <span className="bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/35 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            {course.category}
          </span>
          <div className="flex items-center gap-1.5 font-medium text-amber-400">
            <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-white/30 text-[9px] font-normal">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Rating Row (Mobile - Udemy Style) */}
        <div className="flex lg:hidden items-center gap-1.5 text-[10px] sm:text-xs">
          <span className="font-bold text-[#FAEB92]">{course.rating.toFixed(1)}</span>
          {renderMiniStars(course.rating)}
          <span className="text-white/40 text-[9px]">({course.reviewsCount})</span>
        </div>

        {/* Meta Info - Duration & Lessons (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 py-2 border-y border-white/5 text-[10px] text-white/40">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="size-3" />
            <span>{course.lessons} Materi</span>
          </div>
        </div>

        {/* Pricing */}
        {/* Mobile: Row flow, Desktop: Col flow */}
        <div className="flex flex-row items-center gap-2 lg:flex-col lg:items-start lg:gap-0.5">
          <div className="text-[9px] sm:text-[10px] lg:text-[10px] text-white/40 line-through order-2 lg:order-1">
            {formatRupiah(course.originalPrice)}
          </div>
          <div className="text-xs sm:text-sm lg:text-base font-bold text-[#DDA5FF] order-1 lg:order-2">
            {formatRupiah(course.price)}
          </div>
        </div>

        {/* Mobile Badges (Udemy Style) */}
        <div className="flex lg:hidden items-center gap-1.5">
          {isBestseller ? (
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide bg-amber-400/15 text-[#FAEB92] border border-[#FAEB92]/30 px-1.5 py-0.5 rounded">
              Bestseller
            </span>
          ) : (
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/30 px-1.5 py-0.5 rounded">
              Premium
            </span>
          )}
          <span className="text-[8px] sm:text-[9px] text-white/40 font-medium uppercase">
            {course.level}
          </span>
        </div>

        {/* Action CTA Buttons (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2.5 pt-1">
          <ButtonGlass
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course.id}`);
            }}
            themeType="outline"
            className="flex-grow h-10 px-4 text-xs font-semibold rounded-xl text-white/95"
          >
            Detail
          </ButtonGlass>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentCart = localStorage.getItem("bytestart_cart");
              let cartIds: number[] = [];
              if (currentCart) {
                try {
                  cartIds = JSON.parse(currentCart);
                } catch (err) {
                  // ignore
                }
              }
              if (!cartIds.includes(course.id)) {
                cartIds.push(course.id);
                localStorage.setItem("bytestart_cart", JSON.stringify(cartIds));
                // Dispatch event so other components (like Navbar) update immediately
                window.dispatchEvent(new Event("bytestart_cart_updated"));
                onShowToast(`&ldquo;${course.title}&rdquo; berhasil ditambahkan ke keranjang!`, "success");
              } else {
                onShowToast(`&ldquo;${course.title}&rdquo; sudah ada di dalam keranjang belanja`, "info");
              }
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A156E3] to-[#753795] text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(161,86,227,0.4)] transition-all cursor-pointer border border-[#A156E3]/20 active:scale-95 shrink-0 outline-none"
            title="Tambah ke Keranjang"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
