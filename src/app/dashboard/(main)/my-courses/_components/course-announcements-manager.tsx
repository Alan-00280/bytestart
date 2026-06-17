"use client";

import React from "react";
import { Trash2, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  instructorName: string;
  commentsCount: number;
}

interface CourseAnnouncementsManagerProps {
  announcements: Announcement[];
  newAnnouncementTitle: string;
  setNewAnnouncementTitle: (val: string) => void;
  newAnnouncementContent: string;
  setNewAnnouncementContent: (val: string) => void;
  onAddAnnouncement: (e: React.FormEvent) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export function CourseAnnouncementsManager({
  announcements,
  newAnnouncementTitle,
  setNewAnnouncementTitle,
  newAnnouncementContent,
  setNewAnnouncementContent,
  onAddAnnouncement,
  onDeleteAnnouncement,
}: CourseAnnouncementsManagerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Form: Create Announcement */}
      <div className="lg:col-span-1 border border-white/[0.06] bg-slate-900/10 rounded-2xl p-5 h-fit space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Post Announcement</h4>
        <form onSubmit={onAddAnnouncement} className="space-y-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Announcement Title</label>
            <input
              type="text"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Contoh: Update Roadmap Predictions 2026"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Content Message</label>
            <textarea
              rows={5}
              value={newAnnouncementContent}
              onChange={(e) => setNewAnnouncementContent(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl p-3 text-xs text-white outline-none transition-all resize-none"
              placeholder="Ketik pengumuman baru untuk seluruh siswa terdaftar..."
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer border-none animate-pulse-slow"
          >
            Post Announcement
          </button>
        </form>
      </div>

      {/* Right Panel: Announcements list feed */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Announcements Feed ({announcements.length})</h4>
        
        {announcements.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <span className="text-xs text-slate-500">No announcements posted for this course.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-5 relative group"
              >
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-transparent border-none outline-none"
                  title="Delete Announcement"
                >
                  <Trash2 className="size-4" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-[#A156E3] to-[#892CDC] flex items-center justify-center text-[10px] font-bold border border-white/10 select-none">
                    BS
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{ann.instructorName}</h5>
                    <span className="text-[10px] text-slate-500 block leading-none mt-1">Posted on {ann.date}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-snug">{ann.title}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed whitespace-pre-line">{ann.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
