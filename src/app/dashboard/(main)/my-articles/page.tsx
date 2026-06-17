"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  FileText,
  CheckCircle,
} from "lucide-react";
import { Article, articlesData } from "@/data/articlesMock";

// Import modular sub-components
import { ArticleList } from "./_components/article-list";
import { ArticleGeneralInfo } from "./_components/article-general-info";
import { ArticleContentEditor, ArticleContentSection } from "./_components/article-content-editor";

export default function MyArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Workspace Active Tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"general" | "content">("general");

  // General Form States
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Engineering");
  const [formAuthor, setFormAuthor] = useState("ByteStart Team");
  const [formDate, setFormDate] = useState("");
  const [formReadTime, setFormReadTime] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPopular, setFormPopular] = useState(false);

  // Content Sections States (4 headings & paragraphs)
  const [sections, setSections] = useState<ArticleContentSection[]>([]);

  // Alert/Feedback state
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Load articles from local storage on mount
  useEffect(() => {
    const savedArticles = localStorage.getItem("bytestart_owner_articles");
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (e) {
        setArticles(articlesData);
      }
    } else {
      setArticles(articlesData);
      localStorage.setItem("bytestart_owner_articles", JSON.stringify(articlesData));
    }
  }, []);

  const triggerAlert = (text: string, type: "success" | "error" | "info" = "success") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4500);
  };

  // Edit Article Handler
  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setActiveWorkspaceTab("general");

    // Load general info states
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormAuthor(article.author);
    setFormDate(article.date);
    setFormReadTime(article.readTime);
    setFormImage(article.image);
    setFormSummary(article.summary);
    setFormFeatured(!!article.featured);
    setFormPopular(!!article.popular);

    // Load content sections from local storage
    const savedSections = localStorage.getItem(`bytestart_article_content_${article.id}`);
    if (savedSections) {
      try {
        setSections(JSON.parse(savedSections));
      } catch (e) {
        setSections(generateDefaultSections(article.title));
      }
    } else {
      const def = generateDefaultSections(article.title);
      setSections(def);
      localStorage.setItem(`bytestart_article_content_${article.id}`, JSON.stringify(def));
    }
  };

  // Create Article Action
  const handleCreateArticle = () => {
    const nextId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
    const newArticle: Article = {
      id: nextId,
      title: "New Article " + nextId,
      category: "Engineering",
      summary: "Write a short summary about this new publication.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      author: "ByteStart Team",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      featured: false,
      popular: false,
    };

    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem("bytestart_owner_articles", JSON.stringify(updated));

    // Seed default content sections
    const defaultSections = generateDefaultSections(newArticle.title);
    localStorage.setItem(`bytestart_article_content_${newArticle.id}`, JSON.stringify(defaultSections));

    handleEditArticle(newArticle);
    triggerAlert("Artikel baru berhasil dibuat! Silakan edit konten dan detailnya.", "success");
  };

  // Delete Article Action
  const handleDeleteArticle = (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}" secara permanen?`)) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      localStorage.setItem("bytestart_owner_articles", JSON.stringify(updated));

      // Clean up detail keys
      localStorage.removeItem(`bytestart_article_content_${id}`);

      triggerAlert(`Artikel "${title}" berhasil dihapus.`, "info");
    }
  };

  // Save changes action
  const handleSaveChanges = () => {
    if (!selectedArticle) return;

    const updatedArticle: Article = {
      ...selectedArticle,
      title: formTitle,
      category: formCategory,
      author: formAuthor,
      date: formDate,
      readTime: formReadTime,
      image: formImage,
      summary: formSummary,
      featured: formFeatured,
      popular: formPopular,
    };

    const updatedList = articles.map((a) => (a.id === selectedArticle.id ? updatedArticle : a));
    setArticles(updatedList);
    localStorage.setItem("bytestart_owner_articles", JSON.stringify(updatedList));

    // Save details content
    localStorage.setItem(`bytestart_article_content_${selectedArticle.id}`, JSON.stringify(sections));

    setSelectedArticle(null);
    triggerAlert("Perubahan artikel berhasil disimpan!", "success");
  };

  // Update Section Handler
  const handleUpdateSection = (index: number, field: keyof ArticleContentSection, value: string) => {
    setSections((prev) =>
      prev.map((sec, idx) => (idx === index ? { ...sec, [field]: value } : sec))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert Banner */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-2 border px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-300 ${
            alertMessage.type === "success"
              ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30"
              : alertMessage.type === "info"
              ? "bg-indigo-950/90 text-indigo-400 border-indigo-500/30"
              : "bg-red-950/90 text-red-400 border-red-500/30"
          }`}
        >
          <CheckCircle className="size-5 shrink-0" />
          <span className="text-xs font-semibold">{alertMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      {!selectedArticle ? (
        <ArticleList
          articles={articles}
          onCreateArticle={handleCreateArticle}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
        />
      ) : (
        <div className="flex flex-col gap-6 bg-slate-950/20 rounded-2xl border border-white/[0.06] p-6 backdrop-blur-xl">
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 transition-all cursor-pointer outline-none active:scale-95"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest leading-none">
                  Article Editor Workspace
                </span>
                <h3 className="text-base font-black text-white truncate max-w-md sm:max-w-xl font-poppins mt-0.5">
                  {formTitle || "New Publication Studio"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-500/10 transition-all cursor-pointer border-none"
              >
                <Save className="size-3.5 stroke-[2.5]" />
                <span>Save Workspace</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Workspace Tabs */}
          <div className="flex overflow-x-auto gap-4 border-b border-white/[0.05] pb-1.5 no-scrollbar">
            {[
              { id: "general", label: "General Settings", icon: Settings },
              { id: "content", label: "Article Content Editor", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorkspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceTab(tab.id as any)}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-purple-500 text-purple-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panels */}
          <div className="min-h-[400px]">
            {activeWorkspaceTab === "general" && (
              <ArticleGeneralInfo
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formCategory={formCategory}
                setFormCategory={setFormCategory}
                formAuthor={formAuthor}
                setFormAuthor={setFormAuthor}
                formDate={formDate}
                setFormDate={setFormDate}
                formReadTime={formReadTime}
                setFormReadTime={setFormReadTime}
                formImage={formImage}
                setFormImage={setFormImage}
                formSummary={formSummary}
                setFormSummary={setFormSummary}
                formFeatured={formFeatured}
                setFormFeatured={setFormFeatured}
                formPopular={formPopular}
                setFormPopular={setFormPopular}
              />
            )}

            {activeWorkspaceTab === "content" && (
              <ArticleContentEditor
                sections={sections}
                onUpdateSection={handleUpdateSection}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Generate Default Content Sections matching public renderArticleContent layout
function generateDefaultSections(title: string): ArticleContentSection[] {
  let headings = [
    "Introduction & Core Fundamentals",
    "Key Concepts & Implementation Blueprint",
    "Real-world Applications & Architecture",
    "Conclusion & Future Recommendations",
  ];

  if (title.includes("Next.js")) {
    headings = [
      "Understanding Server Actions in React 19",
      "Securing Server Endpoints & Input Validation",
      "Optimizing Data Caching and Partial Prerendering",
      "Handling Form Mutations",
    ];
  } else if (title.includes("Tailwind")) {
    headings = [
      "The CSS-First Philosophy of Tailwind v4",
      "Migrating from Configs to CSS Variables",
      "Leveraging the Fast Rust-Based Compiler",
      "Best Practices for Building Custom Themes",
    ];
  } else if (title.includes("Figma")) {
    headings = [
      "Structuring Token Foundations in Figma",
      "Managing Variable Collections at Scale",
      "Creating Reusable Responsive Components",
      "Streamlining the Design Handoff Process",
    ];
  }

  return [
    {
      id: "sec-1",
      heading: headings[0],
      paragraph1:
        "Dalam era modern pengembangan web, performa dan pengalaman pengguna adalah segalanya. Dengan diperkenalkannya versi terbaru dari library frontend terpopuler, kita melihat pergeseran paradigma yang mengembalikan fokus ke arsitektur server-first. Pendekatan ini meminimalkan bundle JavaScript di sisi klien dan mempercepat loading awal secara dramatis.",
      paragraph2:
        "Ketika kita menggunakan konsep ini, interaksi data tidak lagi memerlukan lapisan routing API manual. Koneksi berjalan langsung dari deklarasi fungsi di sisi server yang dapat dieksekusi dari form action atau event handler di sisi klien. Ini menghemat waktu pengembangan dan menjaga sinkronisasi tipe data (type-safety) ujung-ke-ujung (end-to-end).",
    },
    {
      id: "sec-2",
      heading: headings[1],
      paragraph1:
        "Namun, kemudahan akses langsung ini membawa tantangan baru dalam ranah keamanan aplikasi web. Karena fungsi server dapat di-trigger langsung dari browser, setiap input wajib divalidasi dengan ketat. Menggunakan validasi skema runtime seperti Zod membantu mencegah serangan injeksi dan memastikan data yang masuk memiliki format yang sesuai sebelum diproses oleh database.",
      paragraph2:
        "Selain validasi input, autentikasi sesi pengguna juga harus diverifikasi di level fungsi itu sendiri. Jangan pernah berasumsi bahwa pemanggil fungsi adalah pengguna yang sah hanya karena tombol di UI tersembunyi. Gunakan enkripsi token JWT dan verifikasi session state di sisi server secara mandiri di awal eksekusi kode.",
    },
    {
      id: "sec-3",
      heading: headings[2],
      paragraph1:
        "Setelah aspek keamanan terpenuhi, langkah penting berikutnya adalah optimasi performa. Mekanisme caching bawaan yang ditawarkan framework harus dimanfaatkan dengan benar. Misalnya, membedakan antara static data (yang jarang berubah) dengan dynamic data (yang berubah setiap detik) memungkinkan kita melakukan Partial Prerendering (PPR).",
      paragraph2:
        "Dengan PPR, bagian shell dari halaman web di-render secara instan dan disajikan dari CDN terdekat, sementara bagian konten dinamis di-fetch di latar belakang. Ini memberikan waktu muat (Time-to-First-Byte) yang sangat cepat sekaligus menjaga keakuratan informasi real-time bagi pembaca.",
    },
    {
      id: "sec-4",
      heading: headings[3],
      paragraph1:
        "Sebagai kesimpulan, transisi menuju arsitektur yang modern ini menuntut pemahaman mendalam tentang siklus hidup data dan batas-batas eksekusi server-klien. Dengan mengedepankan keamanan input, pembagian bundle kode yang efisien, dan caching yang terstruktur, kita dapat menghasilkan website kelas dunia yang cepat, aman, dan memuaskan.",
      paragraph2:
        "Mulailah menerapkan langkah-langkah di atas pada proyek Anda hari ini, dan amati peningkatan skor Core Web Vitals serta kepuasan pengguna akhir Anda secara langsung!",
    },
  ];
}
