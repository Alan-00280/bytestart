"use client";

import React from "react";
import { Sparkles, Search, ChevronDown, ArrowUpCircle, MessageSquare } from "lucide-react";

interface QaTabProps {
  featuredQuestions: any[];
  onUpvoteQuestion: (qId: string) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function QaTab({ featuredQuestions, onUpvoteQuestion, showToast }: QaTabProps) {
  return (
    <div className="max-w-4xl text-slate-300 space-y-6">
      {/* 🌟 Section 1: AI Assistant Prompt Banner (Top Area) */}
      <div className="border border-purple-500/30 rounded-2xl p-4 bg-purple-950/20 flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <Sparkles className="size-5 text-[#892CDC] shrink-0 animate-pulse" />
          <div>
            <h4 className="font-bold text-sm text-white">Get an instant answer from the assistant</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Our AI uses context from the course to help answer most questions immediately.
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast("AI sedang memproses pertanyaan Anda...", "success")}
          className="h-9 px-4 bg-[#892CDC] hover:bg-[#973fe8] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none border-none cursor-pointer shrink-0 shadow-lg shadow-[#892CDC]/20"
        >
          <span>Get an instant answer</span>
          <Sparkles className="size-3.5" />
        </button>
      </div>

      {/* 🌟 Section 2: Search & Filter Control Bar (Middle Area 1) */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="flex w-full items-stretch">
          <input
            type="text"
            placeholder="Search all course questions"
            className="flex-1 bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#892CDC]/50 transition-colors"
          />
          <button
            onClick={() => showToast("Melakukan pencarian forum...", "info")}
            className="w-10 bg-[#892CDC] hover:bg-[#973fe8] rounded-r-xl flex items-center justify-center border-none text-white cursor-pointer active:scale-95 transition-all outline-none aspect-square shrink-0"
          >
            <Search className="size-4" />
          </button>
        </div>

        {/* Filters & Sorting Row */}
        <div className="flex flex-wrap gap-4 items-center mt-4 mb-6">
          {/* Dropdown 1 (Filters) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filters:</span>
            <div className="relative flex items-center">
              <select
                defaultValue="all-lectures"
                className="appearance-none bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:border-[#892CDC]/50 text-xs text-slate-300 font-medium cursor-pointer"
              >
                <option value="all-lectures">All lectures</option>
                <option value="current-lecture">Current lecture</option>
                <option value="my-questions">Questions I asked</option>
                <option value="following">Questions I'm following</option>
              </select>
              <ChevronDown className="size-3 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2 (Sort by) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <div className="relative flex items-center">
              <select
                defaultValue="recommended"
                className="appearance-none bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:border-[#892CDC]/50 text-xs text-slate-300 font-medium cursor-pointer"
              >
                <option value="recommended">Sort by recommended</option>
                <option value="recent">Sort by most recent</option>
                <option value="upvotes">Sort by most upvoted</option>
              </select>
              <ChevronDown className="size-3 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Button 3 */}
          <button
            onClick={() => showToast("Menerapkan filter forum...", "success")}
            className="px-4 py-1.5 h-8 rounded-lg border border-[#892CDC] hover:bg-[#892CDC]/10 text-xs font-semibold text-white transition-all cursor-pointer outline-none bg-transparent active:scale-95"
          >
            Filter questions
          </button>
        </div>
      </div>

      {/* 🌟 Section 3: Featured Questions List Forum (Main Content Area) */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white mb-6">
          Featured questions in this course ({featuredQuestions.length})
        </h3>

        <div className="space-y-6 divide-y divide-slate-900">
          {featuredQuestions.map((fq) => (
            <div key={fq.id} className="flex gap-4 items-start pt-6 first:pt-0">
              {/* Sisi Kiri (User Avatar) */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B]/60 to-[#892CDC]/80 text-white font-poppins font-bold text-xs flex items-center justify-center shrink-0 border border-[#892CDC]/30 shadow-inner select-none">
                {fq.avatar}
              </div>

              {/* Sisi Tengah (Content Flex-1) */}
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => showToast(`Membuka diskusi: "${fq.title}"`, "info")}
                  className="text-sm font-bold text-slate-100 hover:text-purple-400 transition cursor-pointer mb-1"
                >
                  {fq.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">{fq.body}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                  <span className="text-[#892CDC] font-bold">{fq.user}</span>
                  <span>•</span>
                  <button
                    onClick={() => showToast(`Melompat ke ${fq.lecture}`, "info")}
                    className="text-slate-400 font-semibold hover:text-[#892CDC] hover:underline cursor-pointer transition-colors bg-transparent border-none p-0 outline-none"
                  >
                    {fq.lecture}
                  </button>
                  <span>•</span>
                  <span className="font-mono text-[11px] font-light">{fq.time}</span>
                </div>
              </div>

              {/* Sisi Ranan (Statistics & Interaction) */}
              <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                {/* Upvote Tracker */}
                <button
                  onClick={() => onUpvoteQuestion(fq.id)}
                  className="flex items-center gap-1.5 hover:text-[#FAEB92] transition-colors cursor-pointer group bg-transparent border-none outline-none p-0"
                  title="Upvote"
                >
                  <span
                    className={`text-xs font-mono font-bold ${
                      fq.isUpvoted ? "text-[#FAEB92]" : "text-slate-300"
                    }`}
                  >
                    {fq.votes}
                  </span>
                  <ArrowUpCircle
                    className={`size-5 transition-colors ${
                      fq.isUpvoted
                        ? "text-[#FAEB92] fill-[#FAEB92]/20"
                        : "text-slate-500 group-hover:text-[#FAEB92]"
                    }`}
                  />
                </button>

                {/* Comment Tracker */}
                <button
                  onClick={() => showToast("Membuka balasan forum (Simulasi)", "info")}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#892CDC] cursor-pointer transition-colors bg-transparent border-none p-0 outline-none"
                  title="Replies"
                >
                  <span className="text-xs font-mono font-bold text-slate-300">{fq.replies}</span>
                  <MessageSquare className="size-5 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Section 4: Pagination & Action Trigger (Bottom Area) */}
      <div className="pt-6 border-t border-slate-900 mt-6 space-y-4">
        <button
          onClick={() => showToast("Memuat lebih banyak diskusi (Simulasi)", "info")}
          className="w-full py-2.5 rounded-xl border border-purple-500/30 text-center text-sm font-bold text-white hover:bg-purple-600/10 transition mb-6 cursor-pointer bg-transparent outline-none active:scale-95"
        >
          See more
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => showToast("AI sedang memproses pertanyaan Anda...", "success")}
            className="h-10 px-5 bg-[#892CDC] hover:bg-[#973fe8] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none border-none cursor-pointer shadow-lg shadow-[#892CDC]/20"
          >
            <Sparkles className="size-3.5" />
            <span>Get an instant answer</span>
          </button>
          <button
            onClick={() => showToast("Membuka form pertanyaan baru (Simulasi)", "info")}
            className="text-sm font-bold text-slate-200 hover:text-purple-400 transition cursor-pointer bg-transparent border-none outline-none font-poppins"
          >
            Ask a new question
          </button>
        </div>
      </div>
    </div>
  );
}
