"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  ChevronRight, 
  Share2, 
  Globe, 
  Link2, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  User,
  BookOpen
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { articlesData, Article } from "@/data/articlesMock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetail({ params }: PageProps) {
  // Resolve parameters
  const resolvedParams = use(params);
  const router = useRouter();

  // States
  const [currentRole, setCurrentRole] = useState("public");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

  // Find Article
  const article = useMemo(() => {
    return articlesData.find(
      (a) => slugify(a.title) === resolvedParams.slug || a.id.toString() === resolvedParams.slug
    );
  }, [resolvedParams.slug]);

  // Toast notifier helper
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

  // Newsletter Form submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      showToast("Pendaftaran newsletter berhasil! Terima kasih.", "success");
      setNewsletterEmail("");
    }
  };

  if (!article) {
    return (
      <div className="bg-[#0b0314] min-h-screen text-white flex flex-col items-center justify-center p-6 font-sans">
        <h2 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h2>
        <p className="text-white/60 mb-6 text-sm">Maaf, artikel dengan judul atau ID tersebut tidak tersedia di basis data kami.</p>
        <Link 
          href="/articles" 
          className="bg-[#A156E3] hover:bg-[#8e45cf] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
        >
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  // Get headings dynamically based on title
  const headings = getArticleHeadings(article.title);

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

      {/* 1. TOP AREA: ARTICLE HERO BANNER */}
      <section className="bg-slate-950/70 border-b border-white/5 py-12 relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs & Back Button */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
              <Link href="/articles" className="hover:text-[#A156E3] transition-colors">Blog</Link>
              <ChevronRight className="size-3" />
              <span className="text-[#DDA5FF] truncate">{article.category}</span>
            </div>
            
            <Link 
              href="/articles" 
              className="inline-flex items-center gap-1.5 text-xs text-[#A156E3] hover:underline font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Blog</span>
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-poppins font-bold text-white tracking-tight leading-tight max-w-4xl mt-4 mb-6">
            {article.title}
          </h1>

          {/* Summary / Abstract */}
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed font-light">
            {article.summary}
          </p>

          {/* Metadata Meta details */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-6 border-t border-white/5 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <User className="size-4 text-[#A156E3]" />
              <span>Oleh <span className="text-white font-semibold">{article.author}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#A156E3]" />
              <span>Tanggal {article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[#A156E3]" />
              <span>Estimasi {article.readTime}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN CONTENT SPLIT LAYOUT (DESKTOP VIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative flex-grow w-full">
        <div className="flex flex-col-reverse lg:flex-row gap-12 w-full">
          
          {/* 📌 Kolom Kiri: Sticky Navigation Sidebar (Statis di bawah artikel pada mobile, sticky melayang di desktop) */}
          <aside className="w-full lg:w-[30%] relative lg:sticky lg:top-24 lg:self-start flex flex-col gap-8 z-30 border-t border-white/5 lg:border-t-0 pt-10 lg:pt-0 mt-8 lg:mt-0">
            
            {/* 1. Author Profile Mini */}
            <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 order-2 lg:order-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A156E3] to-[#892CDC] flex items-center justify-center text-sm font-bold border-2 border-white/10 shrink-0 select-none">
                {article.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Penulis</span>
                <span className="text-sm font-bold text-white block leading-none mt-0.5">{article.author}</span>
                <span className="text-[10px] text-[#DDA5FF] font-medium block mt-1">Product Marketing Lead</span>
              </div>
            </div>

            {/* 2. Table of Contents (Daftar Isi) */}
            <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.01] shadow-xl order-3 lg:order-2">
              <span className="block text-xs uppercase font-extrabold text-white/40 mb-3 tracking-widest">
                Daftar Isi
              </span>
              <nav className="flex flex-col gap-2.5">
                {headings.map((head, idx) => (
                  <a 
                    key={head.id} 
                    href={`#${head.id}`}
                    className="text-xs text-slate-400 hover:text-[#DDA5FF] transition-colors leading-relaxed hover:underline flex items-start gap-1.5 group"
                  >
                    <span className="text-[#A156E3] font-semibold">{idx + 1}.</span>
                    <span>{head.text}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* 3. Share Social Links */}
            <div className="order-1 lg:order-3">
              <span className="block text-xs uppercase font-extrabold text-white/40 mb-3 tracking-widest">
                Bagikan Artikel
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => showToast("Simulasi membagikan artikel ke Twitter/X", "success")}
                  className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#892CDC]/50 hover:bg-[#892CDC]/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 outline-none"
                  title="Bagikan ke Twitter"
                >
                  <Share2 className="size-4.5" />
                </button>
                <button 
                  onClick={() => showToast("Simulasi membagikan artikel ke Facebook", "success")}
                  className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#892CDC]/50 hover:bg-[#892CDC]/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 outline-none"
                  title="Bagikan ke Facebook"
                >
                  <Globe className="size-4.5" />
                </button>
                <button 
                  onClick={() => showToast("Simulasi membagikan artikel ke LinkedIn", "success")}
                  className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#892CDC]/50 hover:bg-[#892CDC]/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 outline-none"
                  title="Bagikan ke LinkedIn"
                >
                  <Link2 className="size-4.5" />
                </button>
              </div>
            </div>

            {/* 4. Newsletter Box Placeholder */}
            <div className="border border-[#52057B]/30 bg-[#140b20]/45 rounded-2xl p-5 shadow-2xl order-4 lg:order-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DDA5FF] bg-[#892CDC]/15 px-2 py-0.5 rounded self-start block w-max mb-3">
                Newsletter
              </span>
              <h4 className="text-sm font-bold text-white mb-1.5">Dapatkan Berita Eksklusif</h4>
              <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                Unlock exclusive content and build tips directly in your inbox.
              </p>
              
              {newsletterSubmitted ? (
                <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in py-2">
                  <Check className="size-4 shrink-0 bg-emerald-500/10 rounded-full p-0.5 border border-emerald-500/20" />
                  <span>Email Terdaftar! Terima kasih.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Alamat email Anda"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/15 focus:border-[#A156E3]/60 focus:ring-1 focus:ring-[#A156E3]/35 rounded-xl h-10 px-3 text-xs outline-none transition-all placeholder-white/30"
                  />
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold rounded-xl transition-all cursor-pointer outline-none border border-[#892CDC]/20 active:scale-[0.98]"
                  >
                    Daftar Sekarang
                  </button>
                </form>
              )}
            </div>

          </aside>

          {/* 📌 Kolom Kanan: Scrollable Article Body (Lebar: ~70%) */}
          <article className="w-full lg:w-[70%]">
            
            {/* Render the rich text article contents */}
            {renderArticleContent(article.title, headings, article.image)}

            {/* 3. FOOTER META DATA SECTION */}
            <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-medium">
              <span>Last Updated: {article.date}</span>
              <div className="flex items-center gap-1.5">
                <span>Category:</span>
                <Link 
                  href="/articles" 
                  onClick={() => {
                    // Navigate to articles catalog and set category filter (simulated via state or session)
                    showToast(`Menampilkan artikel kategori ${article.category}`, "info");
                  }}
                  className="text-[#DDA5FF] hover:text-[#A156E3] hover:underline font-bold transition"
                >
                  Inside ByteStart
                </Link>
              </div>
            </div>

          </article>

        </div>
      </section>

      {/* TOAST NOTIFICATION CONTAINER */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// Table of Contents Headings Generator
function getArticleHeadings(title: string) {
  if (title.includes("Next.js")) {
    return [
      { id: "understanding-actions", text: "Understanding Server Actions in React 19" },
      { id: "securing-endpoints", text: "Securing Server Endpoints & Input Validation" },
      { id: "optimizing-caching", text: "Optimizing Data Caching and Partial Prerendering" },
      { id: "handling-mutations", text: "Practical Use Case: Handling Form Mutations" }
    ];
  } else if (title.includes("Tailwind")) {
    return [
      { id: "css-first-philosophy", text: "The CSS-First Philosophy of Tailwind v4" },
      { id: "migrating-configs", text: "Migrating from Configs to CSS Variables" },
      { id: "rust-compiler", text: "Leveraging the Fast Rust-Based Compiler" },
      { id: "custom-themes", text: "Best Practices for Building Custom Themes" }
    ];
  } else if (title.includes("Figma")) {
    return [
      { id: "figma-token-foundations", text: "Structuring Token Foundations in Figma" },
      { id: "managing-variables", text: "Managing Variable Collections at Scale" },
      { id: "responsive-components", text: "Creating Reusable Responsive Components" },
      { id: "design-handoff", text: "Streamlining the Design Handoff Process" }
    ];
  } else {
    return [
      { id: "introduction", text: "Introduction & Core Fundamentals" },
      { id: "key-concepts", text: "Key Concepts & Implementation Blueprint" },
      { id: "real-world-apps", text: "Real-world Applications & Architecture" },
      { id: "conclusion", text: "Conclusion & Future Recommendations" }
    ];
  }
}

// Rich-Text Body Content Renderer
function renderArticleContent(title: string, headings: { id: string; text: string }[], courseImage: string) {
  return (
    <div className="prose prose-invert max-w-none text-slate-300 text-base sm:text-lg leading-relaxed space-y-6">
      
      {/* Sub Heading 1 */}
      <h2 id={headings[0].id} className="text-xl sm:text-2xl font-bold text-white pt-4 mt-8 mb-4 border-b border-white/5 pb-2">
        {headings[0].text}
      </h2>
      <p>
        Dalam era modern pengembangan web, performa dan pengalaman pengguna adalah segalanya. 
        Dengan diperkenalkannya versi terbaru dari library frontend terpopuler, kita melihat pergeseran paradigma 
        yang mengembalikan fokus ke arsitektur server-first. Pendekatan ini meminimalkan bundle JavaScript di sisi klien 
        dan mempercepat loading awal secara dramatis.
      </p>
      <p>
        Ketika kita menggunakan konsep ini, interaksi data tidak lagi memerlukan lapisan routing API manual. 
        Koneksi berjalan langsung dari deklarasi fungsi di sisi server yang dapat dieksekusi dari form action atau event handler di sisi klien. 
        Ini menghemat waktu pengembangan dan menjaga sinkronisasi tipe data (type-safety) ujung-ke-ujung (end-to-end).
      </p>

      {/* Rich Media: Image/Infographic */}
      <div className="my-8 group/img">
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-video relative">
          <img 
            src={courseImage} 
            alt="Editorial Infographic Diagram" 
            className="w-full h-full object-cover group-hover/img:scale-101 transition duration-500"
          />
        </div>
        <span className="block text-center text-xs text-slate-500 mt-2.5 font-medium italic">
          Gambar 1.1: Ilustrasi alur data arsitektur modern pada platform ByteStart.
        </span>
      </div>

      {/* Sub Heading 2 */}
      <h2 id={headings[1].id} className="text-xl sm:text-2xl font-bold text-white pt-4 mt-8 mb-4 border-b border-white/5 pb-2">
        {headings[1].text}
      </h2>
      <p>
        Namun, kemudahan akses langsung ini membawa tantangan baru dalam ranah keamanan aplikasi web. 
        Karena fungsi server dapat di-trigger langsung dari browser, setiap input wajib divalidasi dengan ketat. 
        Menggunakan validasi skema runtime seperti Zod membantu mencegah serangan injeksi dan memastikan data yang masuk 
        memiliki format yang sesuai sebelum diproses oleh database.
      </p>
      <p>
        Selain validasi input, autentikasi sesi pengguna juga harus diverifikasi di level fungsi itu sendiri. 
        Jangan pernah berasumsi bahwa pemanggil fungsi adalah pengguna yang sah hanya karena tombol di UI tersembunyi. 
        Gunakan enkripsi token JWT dan verifikasi session state di sisi server secara mandiri di awal eksekusi kode.
      </p>

      {/* Rich Media: Simulated Video Embed Player */}
      <div className="my-8">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#140b20] flex flex-col items-center justify-center group/video shadow-xl">
          <div className="absolute inset-0 bg-black/80 via-black/20 to-black/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80" 
            alt="Video Preview Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover/video:scale-[1.01] transition duration-700"
          />
          <div className="relative z-20 flex flex-col items-center gap-3 select-none">
            <button 
              onClick={() => window.alert("Simulasi pemutaran video demonstrasi artikel")}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer outline-none border-none"
              aria-label="Play Demonstration Video"
            >
              <Play className="size-6 fill-black ml-0.5" />
            </button>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDA5FF] block mb-1">Demonstrasi Video</span>
              <span className="text-[10px] text-white/50 block">Klik untuk memutar simulator video berdurasi 4:15 menit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Heading 3 */}
      <h2 id={headings[2].id} className="text-xl sm:text-2xl font-bold text-white pt-4 mt-8 mb-4 border-b border-white/5 pb-2">
        {headings[2].text}
      </h2>
      <p>
        Setelah aspek keamanan terpenuhi, langkah penting berikutnya adalah optimasi performa. 
        Mekanisme caching bawaan yang ditawarkan framework harus dimanfaatkan dengan benar. 
        Misalnya, membedakan antara static data (yang jarang berubah) dengan dynamic data (yang berubah setiap detik) 
        memungkinkan kita melakukan Partial Prerendering (PPR).
      </p>
      <p>
        Dengan PPR, bagian shell dari halaman web di-render secara instan dan disajikan dari CDN terdekat, 
        sementara bagian konten dinamis di-fetch di latar belakang. Ini memberikan waktu muat (Time-to-First-Byte) yang sangat cepat 
        sekaligus menjaga keakuratan informasi real-time bagi pembaca.
      </p>

      {/* Rich Media: CTA Promo Banner Box */}
      <div className="my-8 bg-gradient-to-r from-[#52057B]/30 via-[#150727] to-[#0b0314] rounded-2xl p-6 border border-[#A156E3]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4.5 shadow-2xl">
        <div className="min-w-0 flex-grow pr-0 sm:pr-4">
          <span className="text-[9px] font-extrabold uppercase tracking-widest bg-amber-400/10 text-[#FAEB92] border border-[#FAEB92]/30 px-2 py-0.5 rounded self-start block w-max mb-2">
            Penawaran Terbatas
          </span>
          <h4 className="text-sm sm:text-base font-poppins font-bold text-white mb-1">
            Kembangkan Keahlian Coding Anda Bersama ByteStart
          </h4>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            Dapatkan diskon khusus 10% untuk semua kelas premium pemrograman dengan kode kupon: <strong className="text-[#DDA5FF] font-semibold">BYTESTART</strong>.
          </p>
        </div>
        <Link 
          href="/courses" 
          className="h-10 px-5 bg-[#892CDC] hover:bg-[#A156E3] hover:shadow-[0_0_15px_rgba(161,86,227,0.3)] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95 border border-[#892CDC]/20"
        >
          <span>Jelajahi Kelas</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Sub Heading 4 */}
      <h2 id={headings[3].id} className="text-xl sm:text-2xl font-bold text-white pt-4 mt-8 mb-4 border-b border-white/5 pb-2">
        {headings[3].text}
      </h2>
      <p>
        Sebagai kesimpulan, transisi menuju arsitektur yang modern ini menuntut pemahaman mendalam tentang siklus hidup data 
        dan batas-batas eksekusi server-klien. Dengan mengedepankan keamanan input, pembagian bundle kode yang efisien, 
        dan caching yang terstruktur, kita dapat menghasilkan website kelas dunia yang cepat, aman, dan memuaskan.
      </p>
      <p>
        Mulailah menerapkan langkah-langkah di atas pada proyek Anda hari ini, dan amati peningkatan skor Core Web Vitals 
        serta kepuasan pengguna akhir Anda secara langsung!
      </p>
      
    </div>
  );
}
