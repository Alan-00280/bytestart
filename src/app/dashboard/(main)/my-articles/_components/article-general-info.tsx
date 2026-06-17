"use client";

import React from "react";
import { articleCategories } from "@/data/articlesMock";

interface ArticleGeneralInfoProps {
  formTitle: string;
  setFormTitle: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formAuthor: string;
  setFormAuthor: (val: string) => void;
  formDate: string;
  setFormDate: (val: string) => void;
  formReadTime: string;
  setFormReadTime: (val: string) => void;
  formImage: string;
  setFormImage: (val: string) => void;
  formSummary: string;
  setFormSummary: (val: string) => void;
  formFeatured: boolean;
  setFormFeatured: (val: boolean) => void;
  formPopular: boolean;
  setFormPopular: (val: boolean) => void;
}

export function ArticleGeneralInfo({
  formTitle,
  setFormTitle,
  formCategory,
  setFormCategory,
  formAuthor,
  setFormAuthor,
  formDate,
  setFormDate,
  formReadTime,
  setFormReadTime,
  formImage,
  setFormImage,
  formSummary,
  setFormSummary,
  formFeatured,
  setFormFeatured,
  formPopular,
  setFormPopular,
}: ArticleGeneralInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 data-lenis-prevent">
      {/* Left Form Column */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Article Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
            placeholder="Enter article title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="bg-slate-900 border border-white/10 hover:border-white/20 focus:border-purple-500/60 rounded-xl h-10 px-3 text-xs text-white outline-none transition-all"
            >
              {articleCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Author Name</label>
            <input
              type="text"
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Date Published</label>
            <input
              type="text"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="e.g. June 8, 2026"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Read Time</label>
            <input
              type="text"
              value={formReadTime}
              onChange={(e) => setFormReadTime(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="e.g. 8 min read"
            />
          </div>
        </div>

        {/* Checkboxes / Switches */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/[0.04] transition-all">
            <input
              type="checkbox"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="size-4 rounded border-white/10 text-purple-600 focus:ring-purple-500/35 bg-slate-900 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Featured Article</span>
              <span className="text-[10px] text-slate-400 font-light">Show in Hero banner</span>
            </div>
          </label>

          <label className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/[0.04] transition-all">
            <input
              type="checkbox"
              checked={formPopular}
              onChange={(e) => setFormPopular(e.target.checked)}
              className="size-4 rounded border-white/10 text-purple-600 focus:ring-purple-500/35 bg-slate-900 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Popular Article</span>
              <span className="text-[10px] text-slate-400 font-light">Show in popular cards</span>
            </div>
          </label>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Banner Image URL</label>
          <input
            type="text"
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
            placeholder="URL image path (e.g. Unsplash URL)"
          />
        </div>

        {/* Thumbnail Preview */}
        {formImage && (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950 aspect-video relative max-h-[140px] w-full">
            <img
              src={formImage}
              alt="Article Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Article Summary</label>
          <textarea
            rows={5}
            value={formSummary}
            onChange={(e) => setFormSummary(e.target.value)}
            className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/60 rounded-xl p-3.5 text-xs text-white outline-none transition-all resize-none leading-relaxed"
            placeholder="Enter a short summary or abstract of the article"
          />
        </div>
      </div>
    </div>
  );
}
