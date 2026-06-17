"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Flame, 
  Clock, 
  MoreVertical, 
  Star, 
  BookOpen, 
  Award, 
  Calendar,
  Sparkles,
  ChevronRight,
  Plus
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, Course } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

interface CourseProgress {
  id: number;
  progress: number;
  rating: number; // Student's personal rating (0 if unrated)
}

export default function MyLearningPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all-courses");
  const [showScheduler, setShowScheduler] = useState(true);

  // Purchased courses dynamic states
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [courseProgressList, setCourseProgressList] = useState<Record<number, CourseProgress>>({});

  // Navigation & Role states
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
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

  // Handle role change
  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  // Load purchased courses and setup progress on mount
  useEffect(() => {
    setMounted(true);

    // Get purchased courses IDs
    const savedPurchased = localStorage.getItem("bytestart_purchased_courses");
    let ids: number[] = [];
    
    if (savedPurchased) {
      try {
        ids = JSON.parse(savedPurchased);
      } catch (e) {
        ids = [1, 2, 11]; // Default
      }
    } else {
      // Initialize with default IDs if none exist
      ids = [1, 2, 11];
      localStorage.setItem("bytestart_purchased_courses", JSON.stringify(ids));
    }
    setPurchasedIds(ids);

    // Initialize/Load course progresses from localStorage
    const savedProgress = localStorage.getItem("bytestart_course_progress");
    let progressMap: Record<number, CourseProgress> = {};
    
    if (savedProgress) {
      try {
        progressMap = JSON.parse(savedProgress);
      } catch (e) {}
    }

    // Ensure all purchased IDs have progress records
    let updated = false;
    ids.forEach((id) => {
      if (!progressMap[id]) {
        // Assign arbitrary progress percentages for demonstration
        let initialProgress = 0;
        if (id === 1) initialProgress = 44; // Next.js 15
        else if (id === 2) initialProgress = 20; // Framer Full Mastery
        else if (id === 11) initialProgress = 75; // Tailwind CSS
        else initialProgress = Math.floor(Math.random() * 80) + 10; // Random default progress

        progressMap[id] = {
          id,
          progress: initialProgress,
          rating: 0 // Unrated initially
        };
        updated = true;
      }
    });

    if (updated || !savedProgress) {
      localStorage.setItem("bytestart_course_progress", JSON.stringify(progressMap));
    }
    setCourseProgressList(progressMap);
  }, []);

  // Map purchased IDs to course details
  const myCourses = useMemo(() => {
    return purchasedIds
      .map(id => {
        const course = coursesData.find(c => c.id === id);
        const progressRecord = courseProgressList[id] || { id, progress: 0, rating: 0 };
        if (!course) return null;
        return {
          ...course,
          progress: progressRecord.progress,
          personalRating: progressRecord.rating
        };
      })
      .filter((c): c is (Course & { progress: number; personalRating: number }) => !!c);
  }, [purchasedIds, courseProgressList]);

  // Handle rating click
  const handleRateCourse = (courseId: number, ratingValue: number, courseTitle: string) => {
    const updatedProgressList = { ...courseProgressList };
    if (updatedProgressList[courseId]) {
      updatedProgressList[courseId] = {
        ...updatedProgressList[courseId],
        rating: ratingValue
      };
      setCourseProgressList(updatedProgressList);
      localStorage.setItem("bytestart_course_progress", JSON.stringify(updatedProgressList));
      showToast(`Terima kasih! Anda memberikan rating ${ratingValue} bintang untuk "${courseTitle}"`, "success");
    }
  };

  // Handle Tab Switch Simulation
  const handleTabSwitch = (tabId: string, tabName: string) => {
    setActiveTab(tabId);
    if (tabId !== "all-courses") {
      showToast(`Mengalihkan ke tab "${tabName}" (Simulasi)`, "info");
    }
  };

  // Render Gold/Empty Stars dynamically for rating selection
  const renderInteractiveStars = (courseId: number, currentRating: number, courseTitle: string) => {
    return (
      <div className="flex items-center gap-0.5 justify-end">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= currentRating;
          return (
            <button
              key={starValue}
              onClick={(e) => {
                e.stopPropagation();
                handleRateCourse(courseId, starValue, courseTitle);
              }}
              className="p-0.5 bg-transparent border-none outline-none cursor-pointer group/star transition-transform active:scale-90"
              title={`Rate ${starValue} stars`}
            >
              <Star
                className={`size-3.5 transition-colors ${
                  isFilled 
                    ? "fill-[#FAEB92] stroke-[#FAEB92]" 
                    : "fill-white/10 stroke-white/20 group-hover/star:stroke-[#FAEB92] group-hover/star:fill-[#FAEB92]/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#892CDC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0314] min-h-screen text-white antialiased overflow-x-clip font-sans relative selection:bg-[#A156E3]/30 flex flex-col">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#52057B]/15 rounded-full blur-[150px] pointer-events-none z-0 select-none" />

      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* SECTION 1: Dark Header Banner & Sub-Navigation */}
      <div className="bg-slate-950 pt-10 border-b border-slate-900 w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            <ChevronRight className="size-3 text-slate-700" />
            <span className="text-slate-300 font-semibold">Dashboard</span>
            <ChevronRight className="size-3 text-slate-700" />
            <span className="text-white">My learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-white mb-6">
            My learning
          </h1>

          {/* Tab lists */}
          <div className="flex overflow-x-auto no-scrollbar gap-6 text-sm font-semibold text-slate-400 pb-3" style={{ scrollbarWidth: "none" }}>
            {[
              { id: "all-courses", name: "All courses" },
              { id: "my-lists", name: "My Lists" },
              { id: "wishlist", name: "Wishlist" },
              { id: "learning-paths", name: "Learning paths" },
              { id: "certifications", name: "Certifications" },
              { id: "archived", name: "Archived" },
              { id: "learning-tools", name: "Learning tools" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id, tab.name)}
                  className={`cursor-pointer pb-2 border-b-2 font-poppins font-semibold transition-all outline-none whitespace-nowrap ${
                    isActive 
                      ? "border-[#892CDC] text-white" 
                      : "border-transparent hover:text-slate-200"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow w-full">
        
        {activeTab === "all-courses" ? (
          <>
            {/* SECTION 2: Gamification Widgets Area */}
            <div className="space-y-6 mb-10">
              
              {/* Widget A: Streak Tracker Card */}
              <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg backdrop-blur-sm">
                
                {/* Visual streak background glow */}
                <div className="absolute -left-10 top-0 w-32 h-32 bg-[#892CDC]/5 rounded-full blur-2xl pointer-events-none" />

                {/* Left Side: Motivational Header */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1 font-poppins">
                    Start a new streak
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed max-w-md">
                    We know you have it in you. Go after your goals! Daily learning habits build master skills.
                  </p>
                </div>

                {/* Middle Side: Streak Statistic */}
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-5 py-3 rounded-2xl shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
                    <Flame className="size-5 fill-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white leading-none">0 weeks</span>
                    <span className="text-[10px] text-slate-400 font-light block mt-1">Current streak</span>
                  </div>
                </div>

                {/* Right Side: Circular Progress Tracker */}
                <div className="flex items-center gap-4 shrink-0 border-t border-slate-800 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                  {/* Custom SVG Circular Ring */}
                  <div className="relative size-12 shrink-0">
                    <svg className="size-full -rotate-90">
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="20" 
                        className="stroke-slate-800 fill-transparent" 
                        strokeWidth="3.5"
                      />
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="20" 
                        className="stroke-[#892CDC] fill-transparent" 
                        strokeWidth="3.5"
                        strokeDasharray="125.6"
                        strokeDashoffset="125.6" // 0% filled
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">0%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span className="text-[#FAEB92]">0/30</span>
                      <span className="text-slate-400 font-normal">course min</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-light block mt-0.5">
                      <strong className="text-[#FAEB92] font-semibold">2/1</strong> visits this week
                    </span>
                  </div>
                </div>

              </div>

              {/* Widget B: Learning Scheduler Card */}
              {showScheduler && (
                <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/10 flex flex-col gap-5 relative overflow-hidden shadow-lg backdrop-blur-sm animate-in fade-in duration-300">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#892CDC]/10 border border-[#892CDC]/25 text-[#DDA5FF] flex items-center justify-center shrink-0">
                      <Clock className="size-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-bold text-lg text-white font-poppins">
                        Schedule learning time
                      </h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed max-w-3xl">
                        Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Schedule calendar reminders to keep your learning progress consistent.
                      </p>
                    </div>
                  </div>

                  {/* Scheduler buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => showToast("Membuka pengaturan jadwal kalender (Simulasi)", "success")}
                      className="px-5 py-2 h-9 rounded-xl border border-[#892CDC] hover:bg-[#892CDC]/10 text-xs font-bold text-white transition-all cursor-pointer outline-none bg-transparent active:scale-95"
                    >
                      Get started
                    </button>
                    <button
                      onClick={() => {
                        setShowScheduler(false);
                        showToast("Widget scheduler disembunyikan", "info");
                      }}
                      className="px-4 py-2 h-9 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* SECTION 3: Purchased Courses Grid */}
            <div className="border-t border-white/5 pt-6">
              <h2 className="text-xl font-bold text-white mb-6 font-poppins">
                Your courses ({myCourses.length})
              </h2>

              {myCourses.length === 0 ? (
                /* Empty state of purchased courses */
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center">
                  <BookOpen className="size-10 text-slate-500 mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">No courses purchased</h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-4">
                    Belum ada kelas yang terdaftar. Beli kelas pemrograman di katalog untuk memulai progres belajar Anda.
                  </p>
                  <Link href="/courses" className="px-4 py-2 bg-[#892CDC] rounded-xl text-xs font-bold hover:bg-[#8e45cf] transition-all">
                    Catalog
                  </Link>
                </div>
              ) : (
                /* Responsive Grid list */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {myCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="bg-white/[0.02] border border-white/10 hover:border-[#892CDC]/30 rounded-2xl p-4 flex flex-col justify-between group shadow-md transition-all duration-300 relative select-none"
                    >
                      {/* Course Link Wrapper for Thumbnail and Title */}
                      <Link href={`/dashboard/my-learning/${course.id}`} className="block group/link cursor-pointer flex-grow">
                        {/* Image header with More Action Button */}
                        <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-4 border border-white/5 bg-neutral-900">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover/link:scale-103 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                            }}
                          />
                          {/* More action floating button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              showToast(`Pilihan menu opsi aksi untuk "${course.title}" (Simulasi)`, "info");
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/5 transition-all cursor-pointer outline-none z-10"
                            aria-label="Options"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </div>

                        {/* Title & Instructor */}
                        <div>
                          <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug group-hover/link:text-[#DDA5FF] transition-colors mb-1">
                            {course.title}
                          </h3>
                          <span className="block text-[11px] text-slate-400 font-light truncate">
                            ByteStart Team
                          </span>
                        </div>
                      </Link>

                      {/* Bottom Section: Progress Bar & Personal Rating Selector */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3.5">
                        
                        {/* Linear Progress Bar */}
                        <div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#892CDC] h-full rounded-full transition-all duration-700" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-medium">
                            <span>{course.progress}% complete</span>
                          </div>
                        </div>

                        {/* Interactive Personal Rating Selector */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <div className="text-left">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block leading-none">
                              Your rating
                            </span>
                            <span className="text-[10px] text-slate-300 font-medium mt-1 block">
                              {course.personalRating > 0 ? `${course.personalRating} Stars` : "Rate course"}
                            </span>
                          </div>
                          
                          {/* Stars selection panel */}
                          {renderInteractiveStars(course.id, course.personalRating, course.title)}
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty tab place holder */
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center mb-10">
            <Sparkles className="size-10 text-[#A156E3] mb-3 animate-pulse" />
            <h2 className="text-lg font-semibold text-white mb-1">Simulated Tab view</h2>
            <p className="text-slate-400 text-xs max-w-xs font-light">
              This panel is dynamically simulated. Switch back to "All courses" to view your purchased courses inventory.
            </p>
          </div>
        )}

      </main>

      {/* TOAST SYSTEM */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* GLOBAL FOOTER */}
      <Footer />

    </div>
  );
}
