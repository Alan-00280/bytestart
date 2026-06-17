"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, ArrowRight, Sparkles, BookOpen, Clock } from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { articlesData, articleCategories, ebooksWebinarsData } from "@/data/articlesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export default function ArticlesPage() {
  const router = useRouter();
  
  // Navigation & Role states (synchronized with other pages)
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Ref for the Webinars Carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  // Kebab case slugify helper
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // Show Toast Helper
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

  // Scroll Carousel helper
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Featured Hero Article (Static selection based on 'featured: true')
  const featuredArticle = useMemo(() => {
    return articlesData.find((a) => a.featured) || articlesData[0];
  }, []);

  // Side Articles list for Section 2 (3 latest articles, excluding featured hero)
  const sideArticles = useMemo(() => {
    return articlesData
      .filter((a) => a.id !== featuredArticle.id && !a.popular)
      .slice(0, 3);
  }, [featuredArticle.id]);

  // Mini Vertical List for Section 3 (4 articles)
  const miniPopularArticles = useMemo(() => {
    return articlesData
      .filter((a) => a.id !== featuredArticle.id)
      .slice(2, 6);
  }, [featuredArticle.id]);

  // Popular Article Card for Section 3 (1 popular article)
  const popularCardArticle = useMemo(() => {
    return articlesData.find((a) => a.popular) || articlesData[1];
  }, []);

  // Filtered Articles for Section 4 (Browse All)
  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "All" || 
        article.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

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

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10 flex-grow w-full">
        
        {/* 🌟 Section 1: Editorial Hero & Filter Bar (Top Area) */}
        <section className="py-12 border-b border-white/5">
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 bg-[#892CDC]/15 text-[#DDA5FF] border border-[#892CDC]/30 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide animate-pulse">
              <Sparkles className="size-3.5" />
              ByteStart Editorial
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-poppins font-bold tracking-tight text-white leading-none">
              Stories, insights, <br className="hidden sm:inline" />
              and <span className="bg-gradient-to-r from-white via-[#DDA5FF] to-[#A156E3] bg-clip-text text-transparent">advice</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-[500px]">
              Transform how you design and build for the web.
            </p>
          </div>

          {/* Filter & Search Bar Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-white/5">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["All", ...articleCategories].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      showToast(`Menampilkan kategori: ${cat}`, "info");
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer outline-none ${
                      isActive 
                        ? "bg-[#892CDC]/20 text-[#DDA5FF] font-semibold border border-[#892CDC]/30" 
                        : "text-slate-400 hover:text-white bg-transparent border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Bar Input */}
            <div className="relative w-full md:w-[280px] border-b border-white/15 focus-within:border-[#A156E3]/60 transition-colors py-1">
              <input
                type="text"
                placeholder="What would you like to read about?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-500 w-full pr-8 outline-none border-none py-1"
              />
              <Search className="absolute right-1 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>
        </section>

        {/* 🌟 Section 2: "Latest Articles" Asymmetric Grid (Middle Area 1) */}
        <section className="py-10 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            
            {/* Kolom Kiri (Lebar: 7 Kolom) - Featured Article Hero */}
            <div className="lg:col-span-7 flex flex-col group cursor-pointer" onClick={() => router.push(`/articles/${slugify(featuredArticle.title)}`)}>
              <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 bg-neutral-900 w-full relative">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDA5FF] mb-2 self-start bg-[#892CDC]/15 px-2.5 py-0.5 rounded border border-[#892CDC]/20">
                {featuredArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-bold text-white group-hover:text-[#DDA5FF] transition leading-snug mb-3">
                {featuredArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {featuredArticle.summary}
              </p>
              <div className="flex items-center gap-3 mt-auto text-[11px] text-slate-500 font-medium">
                <span>{featuredArticle.author}</span>
                <span>•</span>
                <span>{featuredArticle.date}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
              </div>
            </div>

            {/* Kolom Ranan (Lebar: 5 Kolom) - Vertical List Side */}
            <div className="lg:col-span-5 flex flex-col">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                Latest articles
              </h3>
              <div className="flex flex-col divide-y divide-white/10">
                {sideArticles.map((article) => (
                  <div 
                    key={article.id}
                    onClick={() => router.push(`/articles/${slugify(article.title)}`)}
                    className="py-4.5 first:pt-0 last:pb-0 cursor-pointer group flex flex-col"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#A156E3] mb-1.5">
                      {article.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-[#DDA5FF] transition leading-snug">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500 font-medium">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 🌟 Section 3: "Popular" Split Row (Middle Area 2) */}
        <section className="py-12 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Kolom Kiri (Lebar: 5 Kolom) - Mini Vertical List Side */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                Most read this week
              </h3>
              <div className="flex flex-col border border-white/10 rounded-2xl bg-white/[0.01] p-4 divide-y divide-white/5">
                {miniPopularArticles.map((article) => (
                  <div 
                    key={article.id}
                    onClick={() => router.push(`/articles/${slugify(article.title)}`)}
                    className="flex gap-4 items-center py-3.5 cursor-pointer group select-none first:pt-1 last:pb-1"
                  >
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="min-w-0">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#A156E3] block mb-0.5">
                        {article.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#DDA5FF] transition leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Ranan (Lebar: 7 Kolom) - Popular Article Card */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col group cursor-pointer" onClick={() => router.push(`/articles/${slugify(popularCardArticle.title)}`)}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 block lg:hidden">
                Popular
              </h3>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 hidden lg:block">
                Popular article
              </h3>
              
              <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 bg-neutral-900 w-full relative">
                <img
                  src={popularCardArticle.image}
                  alt={popularCardArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDA5FF] mb-2 self-start bg-[#892CDC]/15 px-2.5 py-0.5 rounded border border-[#892CDC]/20">
                {popularCardArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-bold text-white group-hover:text-[#DDA5FF] transition leading-snug mb-3">
                {popularCardArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {popularCardArticle.summary}
              </p>
              <div className="flex items-center gap-3 mt-auto text-[11px] text-slate-500 font-medium">
                <span>{popularCardArticle.author}</span>
                <span>•</span>
                <span>{popularCardArticle.date}</span>
                <span>•</span>
                <span>{popularCardArticle.readTime}</span>
              </div>
            </div>

          </div>
        </section>

        {/* 🌟 Section 4: "Browse All" Clean Grid (Main Catalog Area) */}
        <section className="py-12 border-b border-white/5">
          {/* Section Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Browse all</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-[260px] border border-white/10 bg-white/[0.02] rounded-xl px-4 py-2 focus-within:border-[#A156E3]/60 transition-colors">
              <input
                type="text"
                placeholder="Search for an article"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-500 w-full pr-8 outline-none border-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>

          {/* Clean Grid */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl py-12 px-6 text-center text-xs text-white/40">
              Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => router.push(`/articles/${slugify(article.title)}`)}
                  className="flex flex-col group cursor-pointer border border-white/5 bg-white/[0.01] hover:border-white/10 rounded-2xl p-4.5 transition-all shadow-[0px_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 duration-300"
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3.5 border border-white/5 bg-neutral-900 w-full">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#DDA5FF] transition leading-snug line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-400 mb-4 leading-relaxed font-light">
                    {article.summary}
                  </p>
                  
                  {/* Card Footer row */}
                  <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#DDA5FF] bg-[#892CDC]/10 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {article.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🌟 Section 5: "Ebooks and Webinars" Horizontal Carousel (Bottom Area) */}
        <section className="py-12">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ebooks and webinars</h2>
            {/* Slider Navigation Arrows */}
            <div className="flex gap-2.5">
              <button 
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/5 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                aria-label="Scroll Carousel Left"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button 
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/5 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                aria-label="Scroll Carousel Right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Carousel Row */}
          <div 
            ref={carouselRef}
            className="flex flex-row overflow-x-auto gap-6 pt-4 pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth w-full"
            style={{ scrollbarWidth: "none" }}
          >
            {ebooksWebinarsData.map((item) => (
              <div 
                key={item.id}
                className={`snap-start shrink-0 w-[295px] sm:w-[340px] md:w-[370px] aspect-[4/3] rounded-2xl p-5 border border-white/10 bg-gradient-to-br ${item.bgGradient} flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl`}
              >
                {/* White Contrast Box inside the gradient card */}
                <div className="bg-white/95 text-slate-900 rounded-xl p-5 shadow-2xl flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#892CDC] bg-[#892CDC]/10 px-2 py-0.5 rounded self-start">
                      {item.type}
                    </span>
                    <h4 className="text-sm sm:text-base font-poppins font-bold text-slate-900 leading-snug mt-3">
                      {item.title}
                    </h4>
                  </div>
                  
                  <button 
                    onClick={() => showToast(`Mendownload/Membuka ${item.title} (Simulasi)`, "success")}
                    className="text-xs font-bold text-[#892CDC] hover:text-[#A156E3] transition flex items-center gap-1 mt-4 bg-transparent border-none outline-none cursor-pointer self-start"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* TOAST SYSTEM */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
