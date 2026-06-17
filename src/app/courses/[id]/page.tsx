"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { coursesData, Course } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

// Import modular sub-components
import { CourseStickyHeader } from "./_components/course-sticky-header";
import { CourseHero } from "./_components/course-hero";
import { CourseSidebar, CourseMobilePreview, CourseMobileBottomBar } from "./_components/course-sidebar";
import { CourseFeatures } from "./_components/course-features";
import { CourseDescription } from "./_components/course-description";
import { CourseCurriculum } from "./_components/course-curriculum";
import { CourseReviews } from "./_components/course-reviews";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetail({ params }: PageProps) {
  // Resolve params
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  // States
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Collapse/Expand toggles for sections
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

  // Cart actions
  const handleAddToCart = () => {
    if (!course) return;
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
  };

  const handleBuyNow = () => {
    if (!course) return;
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
      <CourseStickyHeader
        course={course}
        currentPrice={currentPrice}
        isScrolled={isScrolled}
        renderStars={renderStars}
        formatRupiah={formatRupiah}
        onBuyNow={handleBuyNow}
      />

      {/* MAIN CONTAINER (With pb-24 on mobile to prevent content clipping under sticky bottom bar) */}
      <div className="w-full relative z-10 flex-grow pb-24 lg:pb-0">
        
        {/* 2. Video Preview Mobile (Hero Top, visible only on mobile < lg) */}
        <CourseMobilePreview
          course={course}
          showToast={showToast}
        />

        {/* LARGE DARK HERO BANNER (BEFORE SCROLL) */}
        <CourseHero
          course={course}
          renderStars={renderStars}
          isBestseller={isBestseller}
        />

        {/* 2-COLUMN LAYOUT BODY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            
            {/* LEFT COLUMN: Main Content Column */}
            <div className="w-full lg:w-[65%] flex flex-col gap-8">
              
              {/* Section 1, 2, & 3: Related Topics, What You'll Learn, Facilties */}
              <CourseFeatures
                course={course}
                learnItems={dynamicDetails.learn}
                relatedTopics={relatedTopics}
                showAllLearn={showAllLearn}
                setShowAllLearn={setShowAllLearn}
                showToast={showToast}
              />

              {/* Section 4: Requirements & Description */}
              <CourseDescription
                course={course}
                requirements={dynamicDetails.requirements}
                showMoreDesc={showMoreDesc}
                setShowMoreDesc={setShowMoreDesc}
              />

              {/* Section 5: Curriculum */}
              <CourseCurriculum
                course={course}
                syllabus={dynamicDetails.syllabus}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
                onToggleAllSections={handleToggleAllSections}
                showToast={showToast}
              />

              {/* Section 6 & 7: Recommendations, Reviews & Instructor */}
              <CourseReviews
                course={course}
                reviews={reviews}
                studentsAlsoBought={studentsAlsoBought}
                formatRupiah={formatRupiah}
                renderStars={renderStars}
                onCourseClick={(id) => router.push(`/courses/${id}`)}
                showToast={showToast}
              />

            </div>

            {/* RIGHT COLUMN: MORPHING PRICING CARD (STICKY SIDEBAR) */}
            <CourseSidebar
              course={course}
              currentPrice={currentPrice}
              coupon={coupon}
              setCoupon={setCoupon}
              couponApplied={couponApplied}
              onApplyCoupon={handleApplyCoupon}
              formatRupiah={formatRupiah}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              showToast={showToast}
              isScrolled={isScrolled}
            />

          </div>
        </section>

      </div>

      {/* 3. Sticky Bottom Action Bar (Mobile Purchase/Checkout Bar, visible < lg only) */}
      <CourseMobileBottomBar
        currentPrice={currentPrice}
        formatRupiah={formatRupiah}
        onAddToCart={handleAddToCart}
      />

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
        "Meringkas state management global menggunakan Zustand dan Context API.",
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
            { title: "Membuat Flow Hubungan Antar Layar", duration: "15m" },
            { title: "Smart Animate & Micro Interaction", duration: "24m" },
            { title: "Handoff Design & Asset Export", duration: "18m" }
          ]
        }
      ]
    };
  }
}
