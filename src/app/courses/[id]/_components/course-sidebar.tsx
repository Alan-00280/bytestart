"use client";

import React from "react";
import { Play, Check, Clock, ShieldCheck, Award } from "lucide-react";
import { Course } from "@/data/coursesMock";

interface CourseSidebarProps {
  course: Course;
  currentPrice: number;
  coupon: string;
  setCoupon: (val: string) => void;
  couponApplied: boolean;
  onApplyCoupon: (e: React.FormEvent) => void;
  formatRupiah: (val: number) => string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
  isScrolled: boolean;
}

// 1. Desktop Sidebar Component
export function CourseSidebar({
  course,
  currentPrice,
  coupon,
  setCoupon,
  couponApplied,
  onApplyCoupon,
  formatRupiah,
  onAddToCart,
  onBuyNow,
  showToast,
  isScrolled,
}: CourseSidebarProps) {
  return (
    <div className="w-full lg:w-[32%] relative">
      <div 
        className="sticky top-24 self-start z-40 bg-[#11051b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform"
      >
        {/* Video Preview Container (Hides when scrolled, and hidden on mobile < lg) */}
        <div 
          className={`relative w-full aspect-video border-b border-white/5 overflow-hidden group/video select-none hidden lg:block ${
            isScrolled ? "lg:!hidden" : "lg:block animate-in fade-in duration-300"
          }`}
        >
          <img
            src={course.image}
            alt="Course Preview Thumbnail"
            className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-700 brightness-75"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
            }}
          />
          {/* Floating Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5">
            <button 
              onClick={() => showToast("Simulasi memutar video preview kelas", "info")}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer outline-none border-none"
              aria-label="Play Preview Video"
            >
              <Play className="size-5 fill-black ml-0.5" />
            </button>
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/90 drop-shadow-md">
              Preview Kursus Ini
            </span>
          </div>
        </div>

        {/* Card Main Transactional Body */}
        <div className="p-5 flex flex-col">
          
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-white">
                {formatRupiah(currentPrice)}
              </span>
              {couponApplied && (
                <span className="text-xs font-semibold text-[#FAEB92] bg-amber-400/10 border border-[#FAEB92]/30 px-1.5 py-0.5 rounded">
                  Hemat 10%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/40 line-through">
                {formatRupiah(course.originalPrice)}
              </span>
              <span className="text-xs text-[#DDA5FF] font-semibold">
                Diskon {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
              </span>
            </div>
          </div>

          {/* Transaction Buttons */}
          <div className="flex flex-col gap-2.5 mb-5">
            <button
              onClick={onAddToCart}
              className="w-full h-11 bg-[#892CDC] hover:bg-[#A156E3] hover:shadow-[0_0_15px_rgba(161,86,227,0.3)] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none border border-[#892CDC]/20"
            >
              Add to Cart
            </button>
            
            <button
              onClick={onBuyNow}
              className="w-full h-11 bg-transparent hover:bg-white/5 border border-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none"
            >
              Buy Now
            </button>
          </div>

          {/* Coupon Form */}
          <form onSubmit={onApplyCoupon} className="mb-5 pb-5 border-b border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan kode kupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={couponApplied}
                className="flex-grow bg-white/[0.03] border border-white/15 hover:border-white/25 focus:border-[#A156E3]/60 focus:ring-1 focus:ring-[#A156E3]/35 rounded-xl h-9 px-3 text-[11px] outline-none transition-all placeholder-white/35 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={couponApplied || !coupon}
                className="h-9 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 disabled:opacity-40 text-[11px] font-bold rounded-xl transition-all shrink-0 cursor-pointer outline-none active:scale-95"
              >
                Pasang
              </button>
            </div>
            {couponApplied && (
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1.5 flex items-center gap-1 animate-in fade-in">
                <Check className="size-3" />
                Kupon 'BYTESTART' aktif
              </span>
            )}
            <span className="text-[9px] text-white/30 block mt-1">
              Gunakan kupon <strong className="text-white/60 font-semibold">BYTESTART</strong> untuk diskon spesial.
            </span>
          </form>

          {/* Quality Badges */}
          <div className="space-y-3">
            <div className="flex gap-2.5 items-start text-xs text-white/80">
              <Clock className="size-4 text-[#A156E3] shrink-0 mt-0.5" />
              <span>Akses penuh seumur hidup tanpa batas rilis</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs text-white/80">
              <ShieldCheck className="size-4 text-[#A156E3] shrink-0 mt-0.5" />
              <span>Garansi uang kembali 30 hari jika tidak puas</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs text-white/80">
              <Award className="size-4 text-[#A156E3] shrink-0 mt-0.5" />
              <span>Sertifikat penyelesaian ByteStart saat lulus</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// 2. Mobile Video Preview Top Banner
interface CourseMobilePreviewProps {
  course: Course;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function CourseMobilePreview({
  course,
  showToast,
}: CourseMobilePreviewProps) {
  return (
    <div className="block lg:hidden w-full aspect-video relative border-b border-white/10 select-none bg-neutral-950">
      <img
        src={course.image}
        alt="Course Mobile Preview"
        className="w-full h-full object-cover brightness-75"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
        }}
      />
      {/* Floating Play Overlay */}
      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-2.5">
        <button 
          onClick={() => showToast("Simulasi memutar video preview kelas", "info")}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer outline-none border-none animate-pulse"
          aria-label="Play Mobile Preview Video"
        >
          <Play className="size-6 fill-black ml-0.5" />
        </button>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-white drop-shadow-md">
          Preview Kursus Ini
        </span>
      </div>
    </div>
  );
}

// 3. Mobile Bottom Action Bar Sticky
interface CourseMobileBottomBarProps {
  currentPrice: number;
  formatRupiah: (val: number) => string;
  onAddToCart: () => void;
}

export function CourseMobileBottomBar({
  currentPrice,
  formatRupiah,
  onAddToCart,
}: CourseMobileBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-4 shadow-2xl flex lg:hidden items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
      <div>
        <span className="text-[10px] text-white/40 block leading-none mb-1">Harga Kelas</span>
        <span className="text-lg font-bold text-[#DDA5FF] leading-none">
          {formatRupiah(currentPrice)}
        </span>
      </div>
      <button
        onClick={onAddToCart}
        className="flex-grow max-w-[200px] h-11 bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none border border-[#892CDC]/20"
      >
        Add to Cart
      </button>
    </div>
  );
}
