"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  Star, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Check, 
  Globe, 
  Award, 
  Users, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  PlayCircle,
  FileText,
  Download,
  Smartphone,
  Key
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { coursesData, Course } from "@/data/coursesMock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetail({ params }: PageProps) {
  // Resolve params
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  // States
  const [currentRole, setCurrentRole] = useState("public");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Collapse/Expand toggles for new sections
  const [showAllLearn, setShowAllLearn] = useState(false);
  const [showMoreDesc, setShowMoreDesc] = useState(false);

  // Find course
  const course = useMemo(() => {
    return coursesData.find((c) => c.id === courseId);
  }, [courseId]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show toast utility
  const showToast = (text: string, type: "success" | "info" | "role" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleCloseToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle expand/collapse all
  const handleToggleAllSections = (totalSections: number) => {
    const allExpanded = Object.keys(expandedSections).length === totalSections;
    if (allExpanded) {
      setExpandedSections({});
    } else {
      const next: Record<number, boolean> = {};
      for (let i = 0; i < totalSections; i++) {
        next[i] = true;
      }
      setExpandedSections(next);
    }
  };

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "BYTESTART") {
      setCouponApplied(true);
      showToast("Kupon 'BYTESTART' berhasil digunakan! Diskon 10% terpasang.", "success");
    } else {
      showToast("Kupon tidak valid.", "info");
    }
  };

  if (!course) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-2xl font-bold mb-4">Kelas Tidak Ditemukan</h2>
        <p className="text-white/60 mb-6 text-sm">Maaf, kelas dengan ID tersebut tidak tersedia di database kami.</p>
        <Link 
          href="/courses" 
          className="bg-[#A156E3] hover:bg-[#8e45cf] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Calculate prices based on coupon
  const currentPrice = couponApplied ? Math.round(course.price * 0.9) : course.price;
  const isBestseller = course.rating >= 4.9;

  // Format currency Helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Star rendering helper
  const renderStars = (rating: number, size = 4) => {
    const sizeClass = size === 3.5 ? "size-3.5" : `size-${size}`;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < Math.floor(rating)
                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                : "fill-white/10 stroke-white/10"
            }`}
          />
        ))}
      </div>
    );
  };

  // Dynamic details based on category
  const dynamicDetails = getCategoryDetails(course.category);
  const relatedTopics = getRelatedTopics(course.category);

  // Recommendations for Section 6 (Students also bought)
  const studentsAlsoBought = coursesData
    .filter((c) => c.id !== course.id)
    .slice(0, 4);

  // Reviews for Section 7
  const reviews = getMockReviews();

  return (
    <div className="bg-[#0b0314] min-h-screen text-white antialiased font-sans relative selection:bg-[#A156E3]/30 flex flex-col">
      {/* Decorative Glow */}
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

      {/* STICKY THIN HEADER BAR (MORPH) */}
      <div 
        className={`fixed top-0 left-0 w-full h-14 bg-slate-950/95 backdrop-blur-md z-50 border-b border-white/10 flex items-center shadow-lg transition-all duration-300 transform ${
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 pr-4">
            <span className="font-poppins font-bold text-sm text-slate-100 truncate max-w-[200px] sm:max-w-[400px]">
              {course.title}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-[#FAEB92] mt-0.5">{course.rating.toFixed(1)}</span>
              {renderStars(course.rating, 3.5)}
              <span className="text-[10px] text-[#A156E3] font-medium hover:underline cursor-pointer">
                ({course.reviewsCount} rating)
              </span>
            </div>
            <span className="hidden md:inline-block text-[10px] text-white/40 shrink-0">
              | {course.reviewsCount * 4} Siswa
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-sm font-bold text-[#DDA5FF] block">
                {formatRupiah(currentPrice)}
              </span>
            </div>
            <button 
              onClick={() => showToast(`&ldquo;${course.title}&rdquo; berhasil diproses ke checkout!`, "success")}
              className="bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold py-2 px-4 rounded-lg transition-all active:scale-[0.97]"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER (With pb-24 on mobile to prevent content clipping under sticky bottom bar) */}
      <div className="w-full relative z-10 flex-grow pb-24 lg:pb-0">
        
        {/* 2. Video Preview Mobile (Hero Top, visible only on mobile < lg) */}
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

        {/* LARGE DARK HERO BANNER (BEFORE SCROLL) */}
        <section className="bg-slate-950/70 border-b border-white/5 py-12 relative w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full lg:w-[65%] pr-0 lg:pr-8">
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-white/50 mb-4 font-medium">
                <Link href="/courses" className="hover:text-[#A156E3] transition-colors">Katalog</Link>
                <ChevronRight className="size-3" />
                <span className="text-[#DDA5FF] truncate">{course.category}</span>
              </div>

              {/* Bestseller Badge & Rating */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {isBestseller ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-400/15 text-[#FAEB92] border border-[#FAEB92]/30 px-2.5 py-0.5 rounded">
                    Bestseller
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/30 px-2.5 py-0.5 rounded">
                    Premium
                  </span>
                )}
                <span className="bg-white/5 border border-white/10 text-xs px-2 py-0.5 rounded text-white/70">
                  {course.level}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#FAEB92]">{course.rating.toFixed(1)}</span>
                  {renderStars(course.rating, 4)}
                  <span className="text-xs text-[#A156E3] font-semibold hover:underline cursor-pointer ml-1">
                    ({course.reviewsCount} rating)
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-poppins font-bold leading-tight mb-4 text-white">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-white/75 mb-6 max-w-[680px] leading-relaxed">
                {course.description}
              </p>

              {/* Instructor & Metadata details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs text-white/60 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-[#A156E3]" />
                  <span>Dibuat oleh <span className="text-white font-medium">ByteStart Team</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#A156E3]" />
                  <span>Terakhir update <span className="text-white font-medium">Juni 2026</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-[#A156E3]" />
                  <span>Bahasa <span className="text-white font-medium">Indonesia</span></span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2-COLUMN LAYOUT BODY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            
            {/* LEFT COLUMN: Main Content Column */}
            <div className="w-full lg:w-[65%] flex flex-col gap-8">
              
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
                    {dynamicDetails.learn
                      .slice(0, showAllLearn ? dynamicDetails.learn.length : 4)
                      .map((item, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <Check className="size-4.5 text-[#A156E3] shrink-0 mt-0.5 border border-[#892CDC]/25 bg-[#892CDC]/10 rounded-full p-0.5" />
                          <span className="text-xs sm:text-sm text-white/70 leading-relaxed">{item}</span>
                        </div>
                      ))}
                  </div>
                  {dynamicDetails.learn.length > 4 && (
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

              {/* Section 4: Persyaratan & Deskripsi (Requirements & Description) */}
              <div>
                {/* Requirements */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-white">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-white/70">
                    {dynamicDetails.requirements.map((req, idx) => (
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

              {/* Section 5: Kurikulum Pelajaran (Course Content / Syllabus) */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Course content</h2>
                    <p className="text-xs text-white/40 mt-1">
                      {dynamicDetails.syllabus.length} Section • {course.lessons} Materi Kuliah • {course.duration} Total Durasi
                    </p>
                  </div>
                  <button 
                    onClick={() => handleToggleAllSections(dynamicDetails.syllabus.length)}
                    className="text-xs text-[#A156E3] hover:text-[#b46af2] font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
                  >
                    {Object.keys(expandedSections).length === dynamicDetails.syllabus.length ? "Collapse all sections" : "Expand all sections"}
                  </button>
                </div>

                {/* Syllabus Accordion list */}
                <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10 bg-white/[0.01]">
                  {dynamicDetails.syllabus.map((section, idx) => {
                    const isOpen = !!expandedSections[idx];
                    return (
                      <div key={idx} className="transition-all duration-300">
                        {/* Section Header Accordion */}
                        <button
                          onClick={() => toggleSection(idx)}
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

              {/* Section 6: Rekomendasi "Students also bought" */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-white">Students also bought</h2>
                <div className="flex flex-col border border-white/10 rounded-2xl bg-white/[0.01] p-4 divide-y divide-white/5">
                  {studentsAlsoBought.map((item) => {
                    const isItemBestseller = item.rating >= 4.9;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => router.push(`/courses/${item.id}`)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3.5 cursor-pointer group select-none transition-all first:pt-1 last:pb-1"
                      >
                        {/* Left Thumbnail + Middle Info */}
                        <div className="flex gap-4 items-start flex-grow min-w-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                            }}
                          />
                          <div className="min-w-0 flex-grow">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#DDA5FF] transition-colors truncate">
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-white/50 font-medium">
                              {isItemBestseller ? (
                                <span className="font-extrabold uppercase bg-amber-400/10 text-[#FAEB92] border border-[#FAEB92]/30 px-1 py-0.5 rounded text-[8px] tracking-wide shrink-0">
                                  Bestseller
                                </span>
                              ) : (
                                <span className="font-extrabold uppercase bg-[#A156E3]/15 text-[#DDA5FF] border border-[#A156E3]/30 px-1 py-0.5 rounded text-[8px] tracking-wide shrink-0">
                                  Premium
                                </span>
                              )}
                              <div className="flex items-center gap-0.5 font-bold text-[#FAEB92]">
                                <span>{item.rating.toFixed(1)}</span>
                                <Star className="size-2.5 fill-[#FAEB92] stroke-[#FAEB92]" />
                              </div>
                              <span>• {item.duration}</span>
                              <span>• Updated 6/2026</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Pricing Section with left vertical border */}
                        <div className="flex items-center gap-4 shrink-0 sm:pl-4 sm:border-l border-white/10 h-10 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-white">
                              {formatRupiah(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 Section 7: Ulasan Pengguna (Course Reviews Section - Refactored for Mobile Horizontal Scroll) */}
              <div className="border-t border-white/5 pt-8 mb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5 text-white">
                  <Star className="size-5.5 fill-[#FAEB92] stroke-[#FAEB92]" />
                  <span>{course.rating.toFixed(1)} course rating • {course.reviewsCount * 50} ratings</span>
                </h2>
                
                {/* 1. Mobile View: Horizontal Scroll (lg:hidden) */}
                <div 
                  className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar lg:hidden w-full"
                  style={{ scrollbarWidth: "none" }}
                >
                  {reviews.map((rev, idx) => (
                    <div 
                      key={idx} 
                      className="snap-center shrink-0 w-[85vw] max-w-[300px] border border-white/10 bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all select-none"
                    >
                      <div>
                        {/* User Profile Info */}
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B] to-[#892CDC] flex items-center justify-center text-xs font-bold text-white uppercase select-none border border-white/10 shrink-0">
                            {rev.initials}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white leading-none">{rev.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-2.5 ${
                                      i < rev.rating
                                        ? "fill-[#FAEB92] stroke-[#FAEB92]"
                                        : "fill-white/10 stroke-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[9px] text-white/40 font-medium">{rev.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* User Review Text (Line Clamped on mobile) */}
                        <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-4">
                          {rev.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show All Reviews Outline Button (Mobile Only) */}
                <div className="block lg:hidden mt-2 mb-6 w-full">
                  <button 
                    onClick={() => showToast("Simulasi membuka seluruh ulasan kursus", "info")}
                    className="w-full py-3 rounded-xl border border-[#892CDC] text-[#DDA5FF] text-xs font-bold bg-transparent hover:bg-[#892CDC]/5 transition-all outline-none cursor-pointer"
                  >
                    Show all reviews
                  </button>
                </div>

                {/* 2. Desktop View: Standard Grid 2x2 (lg:grid) */}
                <div className="hidden lg:grid grid-cols-2 gap-4">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="border border-white/5 bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between h-full hover:border-white/10 transition-colors">
                      <div>
                        {/* User Profile Info */}
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B] to-[#892CDC] flex items-center justify-center text-xs font-bold text-white uppercase select-none border border-white/10 shrink-0">
                            {rev.initials}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-none">{rev.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-2.5 ${
                                      i < rev.rating
                                        ? "fill-[#FAEB92] stroke-[#FAEB92]"
                                        : "fill-white/10 stroke-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-white/40 font-medium">{rev.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* User Review Text */}
                        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                          {rev.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INSTRUCTOR PROFILE */}
              <div className="border-t border-white/5 pt-8">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Pengajar / Instruktur</h2>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A156E3] to-[#892CDC] flex items-center justify-center text-xl font-bold border-2 border-white/10 shrink-0 select-none">
                    BS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-0.5">ByteStart Team</h3>
                    <p className="text-xs text-[#DDA5FF] font-medium mb-3">Pusat Pendidikan Pemrograman Terpadu</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-white/50 mb-3.5 font-medium">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-[#FAEB92] fill-[#FAEB92]" />
                        <span>4.8 Rating Instruktur</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="size-3 text-[#FAEB92]" />
                        <span>12+ Kursus Aktif</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-3 text-[#FAEB92]" />
                        <span>85,290+ Siswa Belajar</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                      ByteStart adalah tim insinyur perangkat lunak senior, perancang UI/UX berpengalaman, dan pendidik teknologi
                      yang berdedikasi tinggi untuk memberikan materi pembelajaran pemrograman terbaik, modular, praktis, dan siap industri.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MORPHING PRICING CARD (STICKY SIDEBAR) */}
            <div className="w-full lg:w-[32%] relative">
              <div 
                className="sticky top-24 self-start z-40 bg-[#11051b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform"
              >
                
                {/* Video Preview Container (Hides instantly when isScrolled === true, and hidden on mobile < lg) */}
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
                      onClick={() => {
                        const currentCart = localStorage.getItem("bytestart_cart");
                        let cartIds: number[] = [];
                        if (currentCart) {
                          try { cartIds = JSON.parse(currentCart); } catch (e) {}
                        }
                        if (!cartIds.includes(course.id)) {
                          cartIds.push(course.id);
                          localStorage.setItem("bytestart_cart", JSON.stringify(cartIds));
                          window.dispatchEvent(new Event("bytestart_cart_updated"));
                        }
                        showToast(`&ldquo;${course.title}&rdquo; berhasil ditambahkan ke keranjang belanja!`, "success");
                        setTimeout(() => router.push("/cart"), 800);
                      }}
                      className="w-full h-11 bg-[#892CDC] hover:bg-[#A156E3] hover:shadow-[0_0_15px_rgba(161,86,227,0.3)] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none border border-[#892CDC]/20"
                    >
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => {
                        const currentCart = localStorage.getItem("bytestart_cart");
                        let cartIds: number[] = [];
                        if (currentCart) {
                          try { cartIds = JSON.parse(currentCart); } catch (e) {}
                        }
                        if (!cartIds.includes(course.id)) {
                          cartIds.push(course.id);
                          localStorage.setItem("bytestart_cart", JSON.stringify(cartIds));
                          window.dispatchEvent(new Event("bytestart_cart_updated"));
                        }
                        router.push("/cart");
                      }}
                      className="w-full h-11 bg-transparent hover:bg-white/5 border border-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="mb-5 pb-5 border-b border-white/5">
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

          </div>
        </section>

      </div>

      {/* 3. Sticky Bottom Action Bar (Mobile Purchase/Checkout Bar, visible < lg only) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-4 shadow-2xl flex lg:hidden items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
        <div>
          <span className="text-[10px] text-white/40 block leading-none mb-1">Harga Kelas</span>
          <span className="text-lg font-bold text-[#DDA5FF] leading-none">
            {formatRupiah(currentPrice)}
          </span>
        </div>
        <button
          onClick={() => {
            const currentCart = localStorage.getItem("bytestart_cart");
            let cartIds: number[] = [];
            if (currentCart) {
              try { cartIds = JSON.parse(currentCart); } catch (e) {}
            }
            if (!cartIds.includes(course.id)) {
              cartIds.push(course.id);
              localStorage.setItem("bytestart_cart", JSON.stringify(cartIds));
              window.dispatchEvent(new Event("bytestart_cart_updated"));
            }
            showToast(`&ldquo;${course.title}&rdquo; berhasil ditambahkan ke keranjang belanja!`, "success");
            setTimeout(() => router.push("/cart"), 800);
          }}
          className="flex-grow max-w-[200px] h-11 bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-[0.98] outline-none border border-[#892CDC]/20"
        >
          Add to Cart
        </button>
      </div>

      {/* TOAST NOTIFICATION CONTAINER */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// Explore Related Topics Helper
function getRelatedTopics(category: string) {
  if (category === "Frontend Development") {
    return ["React JS", "Redux Framework", "Web Development", "Tailwind CSS", "Next.js 15", "Frontend Architecture"];
  } else if (category === "Backend Development") {
    return ["API Development", "Docker Containers", "Microservices", "PostgreSQL", "System Design", "Backend Security"];
  } else if (category === "Mobile Development") {
    return ["Flutter Dart", "React Native", "iOS Swift", "Android Kotlin", "Mobile Design", "State Management"];
  } else {
    return ["Figma Design", "Framer Motion", "Design Systems", "User Research", "Prototyping", "Handoff"];
  }
}

// User Reviews Helper (Section 7)
function getMockReviews() {
  return [
    {
      initials: "AP",
      name: "Adi Pratama",
      rating: 5,
      date: "1 minggu yang lalu",
      text: "Penjelasan materi sangat detail dan sistematis. Project yang dibangun benar-benar standar industri. Sangat merekomendasikan kelas ini bagi yang ingin mendalami framework ini secara profesional."
    },
    {
      initials: "SD",
      name: "Siti Dahlia",
      rating: 4,
      date: "3 minggu yang lalu",
      text: "Materi Next.js Server Components & Server Actions dijelaskan dengan contoh riil yang mudah diikuti. Sangat mencerahkan untuk memecahkan problem di real-world project."
    },
    {
      initials: "RK",
      name: "Rian Kurniawan",
      rating: 5,
      date: "1 bulan yang lalu",
      text: "Ini adalah kursus terbaik yang pernah saya ambil! Penjelasan modul demi modul sangat rapi, diajarkan clean architecture. Sangat worth it dengan harganya."
    },
    {
      initials: "ML",
      name: "Maria Lestari",
      rating: 5,
      date: "2 bulan yang lalu",
      text: "Penjelasan instruktur sangat lugas dan tidak bertele-tele. Langsung to the point ke core engineering. Disediakan file starter template yang mempermudah pengerjaan project."
    }
  ];
}

// Category details Helper
function getCategoryDetails(category: string) {
  if (category === "Frontend Development") {
    return {
      learn: [
        "Menguasai arsitektur React 19 dan Next.js 15 App Router secara mendalam.",
        "Membangun visual web modern dan responsif dengan utilitas Tailwind CSS v4.",
        "Mengimplementasikan Server Actions dan caching tingkat lanjut untuk optimasi kecepatan.",
        "Mempelajari state management global menggunakan Zustand dan Context API.",
        "Deployment aplikasi ke Vercel dengan konfigurasi optimasi SEO penuh.",
        "Menerapkan clean code, modul reusability, dan integrasi API eksternal."
      ],
      requirements: [
        "Pemahaman dasar HTML, CSS, dan Javascript ES6.",
        "Komputer/Laptop dengan Node.js terinstal.",
        "Koneksi internet untuk mendownload packages."
      ],
      syllabus: [
        {
          title: "Section 1: Dasar & Pengenalan Next.js 15",
          lessons: [
            { title: "Pengenalan Kursus & Workspace Setup", duration: "10m" },
            { title: "Memahami Server vs Client Components", duration: "15m" },
            { title: "Routing Dasar & Dinamis di App Router", duration: "20m" }
          ]
        },
        {
          title: "Section 2: Integrasi Tailwind CSS v4 & Styling",
          lessons: [
            { title: "Setup Tailwind v4 di Next.js", duration: "12m" },
            { title: "Menggunakan CSS Variables & Custom Theme", duration: "18m" },
            { title: "Layouting Flexbox & Grid Lanjut", duration: "25m" }
          ]
        },
        {
          title: "Section 3: Data Fetching & Server Actions",
          lessons: [
            { title: "Fetching Data Server-Side", duration: "22m" },
            { title: "Menggunakan Next.js Server Actions", duration: "30m" },
            { title: "Pencegahan Race Conditions & Optimistic Updates", duration: "20m" }
          ]
        },
        {
          title: "Section 4: State Management & Optimasi UI",
          lessons: [
            { title: "Integrasi Zustand untuk Global State", duration: "25m" },
            { title: "Lazy Loading & Dynamic Imports", duration: "15m" },
            { title: "Lighthouse Performance Audit", duration: "18m" }
          ]
        }
      ]
    };
  } else if (category === "Backend Development") {
    return {
      learn: [
        "Membangun RESTful API berskala enterprise dengan performa tinggi.",
        "Memahami integrasi database SQL & NoSQL beserta pooling koneksi.",
        "Mengamankan API dengan JWT, hashing password, dan CORS policy.",
        "Mengimplementasikan Docker untuk containerization aplikasi.",
        "Memahami pola arsitektur Microservices dan Message Brokers.",
        "Menulis unit testing dan integrasi otomatis dengan CI/CD."
      ],
      requirements: [
        "Memahami logika pemrograman dasar (Javascript, Go, atau Python).",
        "Pemahaman dasar tentang CLI / Terminal.",
        "Docker terinstal di perangkat Anda (opsional)."
      ],
      syllabus: [
        {
          title: "Section 1: Fundamental Arsitektur Backend",
          lessons: [
            { title: "Pengenalan Backend & Protokol HTTP", duration: "15m" },
            { title: "Setup Project & Boilerplate", duration: "20m" },
            { title: "Membuat Endpoint REST Pertama Anda", duration: "18m" }
          ]
        },
        {
          title: "Section 2: Database Modeling & Migration",
          lessons: [
            { title: "Dasar database relasional & PostgreSQL", duration: "25m" },
            { title: "Menulis Schema & Migrasi Database", duration: "22m" },
            { title: "Optimasi Query & Indexing", duration: "30m" }
          ]
        },
        {
          title: "Section 3: Keamanan API & Autentikasi",
          lessons: [
            { title: "Enkripsi Password dengan Bcrypt", duration: "18m" },
            { title: "Implementasi JWT Auth & Middleware", duration: "28m" },
            { title: "Role-Based Access Control (RBAC)", duration: "22m" }
          ]
        }
      ]
    };
  } else if (category === "Mobile Development") {
    return {
      learn: [
        "Membangun aplikasi Android & iOS menggunakan satu codebase.",
        "Menggunakan state management modern untuk sinkronisasi UI.",
        "Mengintegrasikan fitur hardware seperti Kamera dan GPS.",
        "Mengimplementasikan database lokal untuk penyimpanan offline.",
        "Distribusi aplikasi ke Google Play Store dan Apple App Store.",
        "Animasi UI kompleks dan transisi antar halaman yang mulus."
      ],
      requirements: [
        "Pemahaman dasar pemrograman OOP.",
        "Komputer yang memadai (RAM minimal 8GB direkomendasikan).",
        "Perangkat fisik Android/iOS atau emulator terinstal."
      ],
      syllabus: [
        {
          title: "Section 1: Pengenalan Platform & Setup SDK",
          lessons: [
            { title: "Pengenalan Flutter/React Native & Swift", duration: "18m" },
            { title: "Instalasi Android Studio & Xcode", duration: "30m" },
            { title: "Menjalankan Emulator & Hot Reload", duration: "15m" }
          ]
        },
        {
          title: "Section 2: Widget & Komponen UI Dinamis",
          lessons: [
            { title: "Layouting dasar (Row, Column, Stack)", duration: "25m" },
            { title: "Membuat Custom UI & Theme", duration: "22m" },
            { title: "Responsivitas Layar Handphone", duration: "18m" }
          ]
        },
        {
          title: "Section 3: State Management & Database",
          lessons: [
            { title: "Implementasi Provider/Zustand Mobile", duration: "30m" },
            { title: "Penyimpanan Offline SQLite/SwiftData", duration: "28m" },
            { title: "Sinkronisasi Data dengan Server Cloud", duration: "25m" }
          ]
        }
      ]
    };
  } else { // UI/UX Design
    return {
      learn: [
        "Membangun Design System berskala industri di Figma secara kolaboratif.",
        "Menguasai Auto Layout v5, Variabel, dan Komponen Responsif.",
        "Merancang User Journey Map, User Persona, dan arsitektur informasi.",
        "Membuat prototype interaktif dengan micro-animations di Framer.",
        "Melakukan User Testing secara langsung dan menganalisis feedback.",
        "Handoff design yang rapi ke tim Developer."
      ],
      requirements: [
        "Memiliki akun Figma (Gratis).",
        "Ketertarikan pada tipografi, teori warna, dan interaksi visual.",
        "Tidak memerlukan keahlian coding sama sekali."
      ],
      syllabus: [
        {
          title: "Section 1: Workspace Figma & Dasar Desain",
          lessons: [
            { title: "Pengenalan UI/UX & Figma Interface", duration: "15m" },
            { title: "Bekerja dengan Grid & Alignment", duration: "18m" },
            { title: "Tipografi & Skala Font Profesional", duration: "22m" }
          ]
        },
        {
          title: "Section 2: Autolayout & Komponen Reusable",
          lessons: [
            { title: "Mendalami Auto Layout 5.0", duration: "28m" },
            { title: "Membuat Variants & Properties", duration: "25m" },
            { title: "Membuat Form Input & Button Set", duration: "20m" }
          ]
        },
        {
          title: "Section 3: Desain Interaktif & Prototyping",
          lessons: [
            { title: "Membuat Flow Koneksi Antar Layar", duration: "15m" },
            { title: "Smart Animate & Micro Interaction", duration: "24m" },
            { title: "Handoff Design & Asset Export", duration: "18m" }
          ]
        }
      ]
    };
  }
}
