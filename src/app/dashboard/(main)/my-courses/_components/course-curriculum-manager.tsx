"use client";

import React from "react";
import { Plus, Trash2, Video, PlusCircle, Clock } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  hasResources?: boolean;
  resourceName?: string;
}

interface SyllabusSection {
  id: string;
  title: string;
  duration: string;
  videos: VideoItem[];
}

interface CourseCurriculumManagerProps {
  syllabus: SyllabusSection[];
  onAddSection: () => void;
  onEditSectionTitle: (secId: string, title: string) => void;
  onDeleteSection: (secId: string) => void;
  onAddVideo: (secId: string) => void;
  onEditVideoField: (secId: string, vidId: string, field: keyof VideoItem, value: any) => void;
  onDeleteVideo: (secId: string, vidId: string) => void;
}

export function CourseCurriculumManager({
  syllabus,
  onAddSection,
  onEditSectionTitle,
  onDeleteSection,
  onAddVideo,
  onEditVideoField,
  onDeleteVideo,
}: CourseCurriculumManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Curriculum Builder</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Add, edit, or delete syllabus sections and lessons.</p>
        </div>
        <button
          onClick={onAddSection}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-amber-500 hover:text-slate-950 border border-white/10 hover:border-amber-500 text-slate-300 text-[10px] font-extrabold py-2 px-3 rounded-xl transition-all cursor-pointer outline-none"
        >
          <Plus className="size-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {syllabus.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <span className="text-xs text-slate-500">Syllabus is empty. Click Add Section to begin building.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {syllabus.map((section, sIdx) => (
            <div 
              key={section.id} 
              className="border border-white/[0.06] bg-slate-900/10 rounded-2xl overflow-hidden p-4 space-y-4"
            >
              {/* Section Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-3">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-amber-500 shrink-0 font-mono">Sec {sIdx + 1}:</span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => onEditSectionTitle(section.id, e.target.value)}
                    className="flex-1 bg-transparent hover:bg-white/5 focus:bg-white/5 focus:ring-1 focus:ring-amber-500/20 border-none rounded-lg h-8 px-2 text-xs font-bold text-white outline-none transition-all truncate"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                    {section.videos.length} Lectures ({section.duration})
                  </span>
                  <button
                    onClick={() => onAddVideo(section.id)}
                    className="text-[9px] font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                  >
                    <PlusCircle className="size-3" />
                    <span>Add Lesson</span>
                  </button>
                  <button
                    onClick={() => onDeleteSection(section.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none outline-none"
                    title="Delete Section"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Videos List */}
              {section.videos.length === 0 ? (
                <div className="text-center py-5">
                  <span className="text-[11px] text-slate-500">No lessons inside this section. Click Add Lesson to add.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {section.videos.map((vid, vIdx) => (
                    <div 
                      key={vid.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <Video className="size-4 text-slate-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-semibold shrink-0 font-mono">{vIdx + 1}.</span>
                        <input
                          type="text"
                          value={vid.title}
                          onChange={(e) => onEditVideoField(section.id, vid.id, "title", e.target.value)}
                          className="flex-1 bg-transparent hover:bg-white/5 focus:bg-white/5 focus:ring-1 focus:ring-amber-500/20 border-none rounded-lg h-7 px-1.5 text-xs text-slate-200 outline-none transition-all truncate"
                        />
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Duration */}
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3 text-slate-500" />
                          <input
                            type="text"
                            value={vid.duration}
                            onChange={(e) => onEditVideoField(section.id, vid.id, "duration", e.target.value)}
                            className="w-14 bg-transparent hover:bg-white/5 text-center text-xs text-slate-300 font-mono border-none rounded"
                            placeholder="MM:SS"
                          />
                        </div>

                        {/* Resource toggle */}
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-slate-500 font-semibold">Resources:</label>
                          <input
                            type="checkbox"
                            checked={!!vid.hasResources}
                            onChange={(e) => onEditVideoField(section.id, vid.id, "hasResources", e.target.checked)}
                            className="size-3.5 rounded border-white/15 bg-white/5 accent-amber-500 cursor-pointer"
                          />
                        </div>

                        {vid.hasResources && (
                          <input
                            type="text"
                            value={vid.resourceName || ""}
                            onChange={(e) => onEditVideoField(section.id, vid.id, "resourceName", e.target.value)}
                            className="w-28 bg-transparent hover:bg-white/5 text-center text-[10px] text-amber-400 font-mono border-none rounded"
                            placeholder="file-name.zip"
                          />
                        )}

                        <button
                          onClick={() => onDeleteVideo(section.id, vid.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none outline-none"
                          title="Delete Lesson"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
