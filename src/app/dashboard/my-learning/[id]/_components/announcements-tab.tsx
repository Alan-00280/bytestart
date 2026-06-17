"use client";

import React from "react";
import { Flag } from "lucide-react";

interface AnnouncementComment {
  id: string;
  avatar: string;
  user: string;
  time: string;
  body: string;
}

interface AnnouncementsTabProps {
  announcementsComments: AnnouncementComment[];
  newAnnouncementComment: string;
  onCommentChange: (val: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function AnnouncementsTab({
  announcementsComments,
  newAnnouncementComment,
  onCommentChange,
  onAddComment,
  showToast,
}: AnnouncementsTabProps) {
  return (
    <div className="max-w-4xl text-slate-300 space-y-6">
      {/* 🌟 Section 1: Instructor Post Header (Top Area) */}
      <div className="flex items-center gap-4 mb-4 pt-4">
        {/* Sisi Kiri (Foto profil) */}
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          alt="Maximilian"
          className="rounded-full w-12 h-12 object-cover border border-[#892CDC]/20 shadow-lg"
        />
        {/* Sisi Kanan (Metadata) */}
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[#892CDC]">Maximilian</span>
          <span className="text-xs text-slate-400 mt-0.5">posted an announcement • 5 months ago</span>
        </div>
        {/* Report Flag Icon */}
        <button
          onClick={() => showToast("Pengumuman dilaporkan", "info")}
          className="ml-auto text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none outline-none p-1"
          title="Report announcement"
        >
          <Flag className="size-4" />
        </button>
      </div>

      {/* 🌟 Section 2: Announcement Main Content (Article Prose Area) */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">2026 Predictions</h3>
        <p>
          Hi Everyone! It's a new year and obviously an extremely dynamic world - especially for us developers. In
          2026, web frameworks have matured significantly, React 19 is fully integrated, and Next.js 15 is the
          absolute production standard. Here are my main predictions for frontend engineering this year.
        </p>
        <p>
          We will see Turbopack completely overtaking Webpack in all major apps, React Server Actions handling 90%
          of basic form submissions securely without API routes, and styling configurations shifting towards CSS-first
          layouts like Tailwind CSS v4.
        </p>
        <p>
          You can read more about Next.js 15 roadmap in the{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast("Mengalihkan ke dokumentasi Next.js...", "info");
            }}
            className="text-[#892CDC] underline hover:text-purple-400 transition-colors"
          >
            official documentation
          </a>{" "}
          or check out our codebase examples.
        </p>
      </div>

      {/* 🌟 Section 3: Interactive Comment Form (Middle Area) */}
      <div className="flex items-start gap-4 border-t border-b border-slate-800 py-6 mb-6">
        {/* Sisi Kiri (User avatar initials) */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-slate-900 border border-slate-800 text-white select-none shrink-0 shadow-inner">
          LA
        </div>
        {/* Sisi Kanan (Flex-1) */}
        <form onSubmit={onAddComment} className="flex-1 flex flex-col gap-3">
          <textarea
            rows={2}
            value={newAnnouncementComment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Enter your comment"
            className="w-full text-sm bg-slate-900/50 border border-[#52057B] text-white rounded-xl p-3 placeholder-slate-600 focus:outline-none focus:border-[#892CDC] focus:ring-1 focus:ring-[#892CDC] transition-all"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newAnnouncementComment.trim()}
              className="h-8 px-4 bg-[#892CDC] hover:bg-[#973fe8] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#892CDC] disabled:active:scale-100 text-white text-xs font-bold rounded-lg cursor-pointer transition-all border-none outline-none shadow-md shadow-[#892CDC]/10"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* 🌟 Section 4: Students Comment Feed (Bottom Area) */}
      <div className="flex flex-col gap-6">
        {announcementsComments.map((comment) => (
          <div key={comment.id} className="flex gap-4 items-start">
            {/* Student Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#52057B]/30 to-[#892CDC]/50 border border-[#892CDC]/20 text-slate-200 font-poppins font-bold text-xs flex items-center justify-center shrink-0 select-none shadow-sm">
              {comment.avatar}
            </div>
            {/* Comment Content (Flex-1) */}
            <div className="flex-1 min-w-0">
              {/* Baris Atas */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[#892CDC] text-sm">{comment.user}</span>
                  <span className="text-xs text-slate-500 font-mono font-light">{comment.time}</span>
                </div>
                <button
                  onClick={() => showToast("Komentar dilaporkan", "info")}
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none outline-none p-1"
                  title="Report comment"
                >
                  <Flag className="size-3.5" />
                </button>
              </div>
              {/* Baris Bawah */}
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
