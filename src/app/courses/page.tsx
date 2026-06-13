"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  RotateCcw, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck 
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { CourseCard } from "@/components/courses/CourseCard";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, categories, levels, Course } from "@/data/coursesMock";

// Local Course Carousel component for sliding functionality
interface CourseCarouselProps {
  courses: Course[];
  onShowToast: (text: string, type?: "success" | "info" | "role") => void;
  emptyMessage?: string;
}

function CourseCarousel({ courses, onShowToast, emptyMessage = "Tidak ada kelas yang cocok dengan filter aktif." }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl py-8 px-6 text-center text-xs text-white/40">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile view: 3-row horizontal scrolling grid */}
      <div 
        className="grid grid-rows-3 grid-flow-col gap-4 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory lg:hidden w-full h-[375px] sm:h-[430px]"
        style={{ scrollbarWidth: "none" }}
      >
        {courses.map((course) => (
          <div key={course.id} className="snap-start shrink-0 w-[290px] sm:w-[320px] h-full">
            <CourseCard course={course} onShowToast={onShowToast} />
          </div>
        ))}
      </div>

      {/* Desktop view: Horizontal sliding carousel */}
      <div className="hidden lg:block relative group/carousel w-full">
        {/* Left Arrow Button (Floats, visible on hover) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/90 border border-white/10 hover:border-white text-white flex items-center justify-center cursor-pointer shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-black active:scale-95 duration-300"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="w-full flex flex-row overflow-x-auto gap-5 pb-4 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {courses.map((course) => (
            <div key={course.id} className="snap-start shrink-0 w-[320px]">
              <CourseCard course={course} onShowToast={onShowToast} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button (Floats, visible on hover) */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/90 border border-white/10 hover:border-white text-white flex items-center justify-center cursor-pointer shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-black active:scale-95 duration-300"
          aria-label="Scroll Right"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

// Recommended Topics List
const recommendedTopics = [
  "Next.js",
  "Tailwind CSS",
  "React Hooks",
  "Full Stack Web Development",
  "Golang REST API",
  "iOS SwiftUI",
  "Python Microservices",
  "TypeScript Core",
  "Figma Layouts",
  "Framer Motion",
  "UI/UX System Design",
  "State Management"
];

export default function CourseCatalog() {
  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState("public");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show toast utility
  const showToast = (text: string, type: "success" | "info" | "role" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Close toast helper
  const handleCloseToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle category check change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle level check change
  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    showToast("Filter berhasil dibersihkan", "info");
  };

  // Handle role change
  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  // Handle topic pill click
  const handleTopicClick = (topicName: string) => {
    setSearchQuery(topicName);
    showToast(`Mencari topik: ${topicName}`, "info");
  };

  // Base Filter logic
  const filteredAll = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        course.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(course.category);

      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(course.level);

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategories, selectedLevels]);

  // Section Partitions (filtered dynamically)
  const whatToLearnNextCourses = useMemo(() => {
    // Show all matching courses for recommendation
    return filteredAll;
  }, [filteredAll]);

  const reactViewedCourses = useMemo(() => {
    // Show Frontend & Design related courses
    return filteredAll.filter(c => 
      c.category === "Frontend Development" || 
      c.category === "UI/UX Design"
    );
  }, [filteredAll]);

  const popularForDevelopersCourses = useMemo(() => {
    // Show Backend & Mobile related courses
    return filteredAll.filter(c => 
      c.category === "Backend Development" || 
      c.category === "Mobile Development"
    );
  }, [filteredAll]);

  const trendingCourses = useMemo(() => {
    // Show courses rated >= 4.8
    return filteredAll.filter(c => c.rating >= 4.8);
  }, [filteredAll]);

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedLevels.length > 0;

  return (
    <div className="bg-[#0b0314] min-h-screen text-white antialiased overflow-x-clip font-sans relative selection:bg-[#A156E3]/30 flex flex-col">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#52057B]/15 rounded-full blur-[150px] pointer-events-none z-0 select-none" />

      {/* Global CSS style block for Webkit scrollbar hiding */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* MAIN CONTENT AREA (UDEMY STRUCTURE) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10 flex-grow w-full">
        
        {/* HERO TITLE SECTION (HARMONIZED) */}
        <section className="py-12 border-b border-white/5 mb-10">
          <div className="mb-0">
            <span className="inline-flex items-center gap-1.5 bg-[#892CDC]/15 text-[#DDA5FF] border border-[#892CDC]/30 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide animate-pulse">
              <Sparkles className="size-3.5" />
              Platform Terpercaya
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-poppins font-bold tracking-tight text-white leading-none">
              Jelajahi Kursus <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-[#DDA5FF] to-[#A156E3] bg-clip-text text-transparent">Pemrograman Terbaik</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-[620px]">
              Tingkatkan keahlian coding Anda dengan kurikulum terstruktur dan proyek riil langsung dari industri.
            </p>
          </div>
        </section>

        {/* ----------------- RELOCATION: HORIZONTAL SEARCH & FILTER BAR ----------------- */}
        <div className="mb-10 w-full relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
            
            {/* Search Input Box */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 size-4.5" />
              <input
                type="text"
                placeholder="Cari kursus pemrograman (kategori, judul, topik)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white/[0.04] border border-white/10 rounded-xl pl-12 pr-10 text-sm text-white placeholder-white/40 outline-none focus:border-[#A156E3]/50 focus:ring-1 focus:ring-[#A156E3]/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer bg-transparent border-none outline-none"
                  aria-label="Clear Search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={`h-12 flex items-center justify-center gap-2 px-6 rounded-xl text-sm font-semibold transition-all cursor-pointer border w-full sm:w-auto outline-none ${
                filterPanelOpen 
                  ? "bg-[#A156E3] text-white border-[#A156E3] shadow-lg shadow-[#A156E3]/20" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              }`}
            >
              <SlidersHorizontal className="size-4" />
              <span>Filter</span>
              {(selectedCategories.length + selectedLevels.length) > 0 && (
                <span className="bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {selectedCategories.length + selectedLevels.length}
                </span>
              )}
            </button>

            {/* Quick Reset Trigger */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="h-12 flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white px-4 rounded-xl text-xs transition-all cursor-pointer w-full sm:w-auto bg-transparent"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Baris 2: Collapsible Filter Panel (Horizontal layout) */}
          {filterPanelOpen && (
            <div className="bg-[#11051b] border border-white/10 rounded-2xl p-5 mt-3 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-3 duration-300">
              
              {/* Category selector */}
              <div className="flex-grow">
                <span className="block text-xs uppercase font-bold text-white/40 mb-3.5 tracking-wider">Kategori Kelas</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`text-xs px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer select-none outline-none ${
                          isChecked
                            ? "bg-[#A156E3]/20 border-[#A156E3] text-[#DDA5FF] font-medium"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {isChecked && <Check className="size-3" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level selector */}
              <div className="md:w-[280px] shrink-0">
                <span className="block text-xs uppercase font-bold text-white/40 mb-3.5 tracking-wider">Tingkat Kesulitan</span>
                <div className="flex flex-wrap gap-2">
                  {levels.map((lvl) => {
                    const isChecked = selectedLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        onClick={() => handleLevelChange(lvl)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer select-none outline-none ${
                          isChecked
                            ? "bg-[#A156E3]/20 border-[#A156E3] text-[#DDA5FF] font-medium"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span>{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ----------------- SECTION 1: WELCOME & CONTEXT HEADER ----------------- */}
        <div className="mb-10 py-5 border-y border-white/5 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Welcome back, Luthfi
            <span className="text-xs font-normal bg-[#A156E3]/20 text-[#DDA5FF] border border-[#A156E3]/35 px-2 py-0.5 rounded-full">
              Demo Mode
            </span>
          </h2>
          <p className="text-xs text-white/50">
            Software Developer | Rekomendasi disusun berdasarkan minat belajar Anda
          </p>
        </div>

        {/* ----------------- SECTION 2: WHAT TO LEARN NEXT ----------------- */}
        <section className="mb-12">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white tracking-tight">What to learn next</h3>
            <p className="text-xs text-white/50">Recommended for you</p>
          </div>
          <CourseCarousel 
            courses={whatToLearnNextCourses} 
            onShowToast={showToast} 
            emptyMessage="Tidak ada rekomendasi yang cocok dengan filter Anda." 
          />
        </section>

        {/* ----------------- SECTION 3: BECAUSE YOU VIEWED ----------------- */}
        <section className="mb-12">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              Because you viewed{" "}
              <Link href="#" onClick={(e) => { e.preventDefault(); showToast("Simulasi navigasi detail React Course", "info"); }} className="text-[#A156E3] hover:underline hover:text-[#b46af2] transition-colors font-semibold">
                &ldquo;The Ultimate React Course 2025: React, Next.js, Redux & More&rdquo;
              </Link>
            </h3>
            <p className="text-xs text-white/50">Kelas terpopuler seputar Frontend Development dan UI/UX Design</p>
          </div>
          <CourseCarousel 
            courses={reactViewedCourses} 
            onShowToast={showToast} 
            emptyMessage="Tidak ada kelas Frontend/UI yang cocok dengan filter aktif."
          />
        </section>

        {/* ----------------- SECTION 4: POPULAR FOR SOFTWARE DEVELOPERS ----------------- */}
        <section className="mb-12">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">Popular for Software Developers</h3>
              <button 
                onClick={() => showToast("Simulasi edit occupation modal", "info")}
                className="text-xs text-[#A156E3] hover:text-[#b46af2] hover:underline cursor-pointer font-semibold bg-transparent border-none outline-none"
              >
                Edit occupation
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/25 px-1.5 py-0.5 rounded">
                New
              </span>
              <p className="text-xs text-white/40">Inspired by your selections</p>
            </div>
          </div>
          <CourseCarousel 
            courses={popularForDevelopersCourses} 
            onShowToast={showToast} 
            emptyMessage="Tidak ada kelas Backend/Mobile yang cocok dengan filter aktif."
          />
        </section>

        {/* ----------------- SECTION 5: TRENDING COURSES ----------------- */}
        <section className="mb-14">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Trending courses</h3>
            <p className="text-xs text-white/50">Kelas ber-rating tertinggi yang disukai oleh ribuan siswa minggu ini</p>
          </div>
          <CourseCarousel 
            courses={trendingCourses} 
            onShowToast={showToast} 
            emptyMessage="Tidak ada kelas trending (rating >= 4.8) yang cocok dengan filter aktif."
          />
        </section>

        {/* ----------------- SECTION 6: TOPICS RECOMMENDED FOR YOU (PILLS) ----------------- */}
        <section className="mb-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-white tracking-tight">Topics recommended for you</h3>
            <p className="text-xs text-white/50">Klik topik di bawah ini untuk mencari kelas secara cepat</p>
          </div>

          {/* Grid layout for Pills (2 Rows) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {recommendedTopics.map((topic) => {
              const isActive = searchQuery.toLowerCase() === topic.toLowerCase();
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer outline-none select-none active:scale-[0.97] ${
                    isActive
                      ? "bg-[#A156E3] border-[#A156E3] text-white shadow-lg shadow-[#A156E3]/20"
                      : "bg-white/[0.02] border-white/10 text-white/80 hover:border-[#A156E3]/60 hover:bg-[#A156E3]/5 hover:text-white hover:shadow-[0_0_15px_rgba(161,86,227,0.15)]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* TOAST SYSTEM CONTAINER */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
