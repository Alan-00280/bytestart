"use client";

import React from "react";

interface CourseGeneralInfoProps {
  formTitle: string;
  setFormTitle: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formLevel: "Pemula" | "Menengah" | "Mahir";
  setFormLevel: (val: "Pemula" | "Menengah" | "Mahir") => void;
  formPrice: number;
  setFormPrice: (val: number) => void;
  formOriginalPrice: number;
  setFormOriginalPrice: (val: number) => void;
  formDuration: string;
  setFormDuration: (val: string) => void;
  formImage: string;
  setFormImage: (val: string) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  totalLessons: number;
}

export function CourseGeneralInfo({
  formTitle,
  setFormTitle,
  formCategory,
  setFormCategory,
  formLevel,
  setFormLevel,
  formPrice,
  setFormPrice,
  formOriginalPrice,
  setFormOriginalPrice,
  formDuration,
  setFormDuration,
  formImage,
  setFormImage,
  formDescription,
  setFormDescription,
  totalLessons,
}: CourseGeneralInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Form */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Course Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
            placeholder="Masukkan judul kelas"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="bg-slate-900 border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3 text-xs text-white outline-none transition-all"
            >
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Level</label>
            <select
              value={formLevel}
              onChange={(e) => setFormLevel(e.target.value as any)}
              className="bg-slate-900 border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3 text-xs text-white outline-none transition-all"
            >
              <option value="Pemula">Pemula (Beginner)</option>
              <option value="Menengah">Menengah (Intermediate)</option>
              <option value="Mahir">Mahir (Advanced)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Promo Price (IDR)</label>
            <input
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Harga promo"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Original Price (IDR)</label>
            <input
              type="number"
              value={formOriginalPrice}
              onChange={(e) => setFormOriginalPrice(parseInt(e.target.value) || 0)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Harga asli"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Total Duration</label>
            <input
              type="text"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Contoh: 24 Jam"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Lessons (Autocalculated)</label>
            <input
              type="text"
              value={`${totalLessons} Pelajaran`}
              disabled
              className="bg-white/[0.01] border border-white/5 text-slate-500 rounded-xl h-10 px-3.5 text-xs outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Banner Thumbnail Image URL</label>
          <input
            type="text"
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
            placeholder="URL Gambar Thumbnail"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Course Description</label>
          <textarea
            rows={6}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl p-3.5 text-xs text-white outline-none transition-all resize-none"
            placeholder="Masukkan ringkasan materi pelajaran kelas"
          />
        </div>
      </div>
    </div>
  );
}
