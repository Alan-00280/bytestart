"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Article, articlesData } from "@/data/articlesMock";
import { ArticleList } from "./_components/article-list";

export default function MyArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
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

  // Edit Article Handler: redirect to slug editor
  const handleEditArticle = (article: Article) => {
    router.push(`/dashboard/my-articles/${article.id}`);
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

    router.push(`/dashboard/my-articles/${newArticle.id}`);
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

      <ArticleList
        articles={articles}
        onCreateArticle={handleCreateArticle}
        onEditArticle={handleEditArticle}
        onDeleteArticle={handleDeleteArticle}
      />
    </div>
  );
}

// Generate Default Content Sections matching public renderArticleContent layout
function generateDefaultSections(title: string) {
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
