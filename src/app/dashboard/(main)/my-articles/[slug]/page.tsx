"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  FileText, 
  CheckCircle 
} from "lucide-react";
import { Article, articlesData } from "@/data/articlesMock";

// Import modular sub-components from parent directory
import { ArticleGeneralInfo } from "../_components/article-general-info";
import { ArticleContentEditor, ArticleContentSection } from "../_components/article-content-editor";

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const articleId = parseInt(slug, 10);

  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Workspace Active Tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"general" | "content">("general");

  // Details States
  const [sections, setSections] = useState<ArticleContentSection[]>([]);

  // Form states for general info
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Engineering");
  const [formAuthor, setFormAuthor] = useState("ByteStart Team");
  const [formDate, setFormDate] = useState("");
  const [formReadTime, setFormReadTime] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPopular, setFormPopular] = useState(false);

  // Alert/Feedback state
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Load article details on mount
  useEffect(() => {
    setMounted(true);
    const savedArticles = localStorage.getItem("bytestart_owner_articles");
    let parsedArticles = articlesData;
    if (savedArticles) {
      try {
        const parsed = JSON.parse(savedArticles);
        if (Array.isArray(parsed)) parsedArticles = parsed;
      } catch (e) {}
    }
    setArticles(parsedArticles);

    const article = parsedArticles.find((a) => a.id === articleId);
    if (article) {
      setSelectedArticle(article);

      // Set general info states
      setFormTitle(article.title);
      setFormCategory(article.category);
      setFormAuthor(article.author);
      setFormDate(article.date);
      setFormReadTime(article.readTime);
      setFormImage(article.image);
      setFormSummary(article.summary);
      setFormFeatured(!!article.featured);
      setFormPopular(!!article.popular);

      // Load content sections
      const savedContent = localStorage.getItem(`bytestart_article_content_${article.id}`);
      if (savedContent) {
        try {
          setSections(JSON.parse(savedContent));
        } catch (e) {
          setSections(generateDefaultSections(article.title));
        }
      } else {
        const def = generateDefaultSections(article.title);
        setSections(def);
        localStorage.setItem(`bytestart_article_content_${article.id}`, JSON.stringify(def));
      }
    }
  }, [articleId]);

  const triggerAlert = (text: string, type: "success" | "error" | "info" = "success") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4500);
  };

  const handleBack = () => {
    router.push("/dashboard/my-articles");
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
    localStorage.setItem("bytestart_owner_articles", JSON.stringify(updatedList));

    // Save details content
    localStorage.setItem(`bytestart_article_content_${selectedArticle.id}`, JSON.stringify(sections));

    triggerAlert("Seluruh perubahan artikel berhasil disimpan!", "success");
    setTimeout(() => {
      router.push("/dashboard/my-articles");
    }, 800);
  };

  // Update specific section
  const handleUpdateSection = (index: number, field: keyof ArticleContentSection, value: string) => {
    const updated = sections.map((sec, idx) => (idx === index ? { ...sec, [field]: value } : sec));
    setSections(updated);
  };

  if (!mounted || !selectedArticle) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h2>
        <p className="text-white/60 mb-6 text-sm">Maaf, artikel dengan ID tersebut tidak tersedia di database studio Anda.</p>
        <button
          onClick={handleBack}
          className="bg-[#892CDC] hover:bg-[#A156E3] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all border-none cursor-pointer"
        >
          Kembali ke Studio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert Banner */}
      {alertMessage && (
        <div className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-2 border px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-300 ${
          alertMessage.type === "success"
            ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30"
            : alertMessage.type === "info"
            ? "bg-indigo-950/90 text-indigo-400 border-indigo-500/30"
            : "bg-red-950/90 text-red-400 border-red-500/30"
        }`}>
          <CheckCircle className="size-5 shrink-0" />
          <span className="text-xs font-semibold">{alertMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 bg-slate-950/20 rounded-2xl border border-white/[0.06] p-6 backdrop-blur-xl">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 transition-all cursor-pointer outline-none active:scale-95"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <span className="text-[9px] font-bold text-[#DDA5FF] uppercase tracking-widest leading-none font-mono">Article Studio Workspace</span>
              <h3 className="text-base font-black text-white truncate max-w-md sm:max-w-xl font-poppins mt-0.5">
                {formTitle || "New Article Publication"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
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
            { id: "content", label: "Article Content Editor", icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#892CDC] text-[#DDA5FF] font-extrabold"
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
