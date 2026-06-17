"use client";

import React from "react";
import { Monitor, Folder, FolderOpen, Download, ExternalLink, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import { VideoItem } from "./video-player";

export interface ResourceFile {
  name: string;
  type: "download" | "link";
  url: string;
}

export interface SyllabusSection {
  id: string;
  title: string;
  duration: string;
  videos: VideoItem[];
}

interface PlaylistSidebarProps {
  syllabus: SyllabusSection[];
  completedLessons: string[];
  flatVideosList: VideoItem[];
  activeVideoId: string;
  courseCompletionRate: number;
  expandedSections: Record<string, boolean>;
  openResourcesId: string | null;
  onToggleSection: (secId: string) => void;
  onVideoSelect: (vidId: string) => void;
  onCompleteLesson: (vidId: string) => void;
  onOpenResourcesToggle: (vidId: string) => void;
  getResourcesForVideo: (vid: VideoItem) => ResourceFile[];
  showToast: (text: string, type?: "success" | "info" | "role") => void;
  onClosePlayer: () => void;
}

export function PlaylistSidebar({
  syllabus,
  completedLessons,
  flatVideosList,
  activeVideoId,
  courseCompletionRate,
  expandedSections,
  openResourcesId,
  onToggleSection,
  onVideoSelect,
  onCompleteLesson,
  onOpenResourcesToggle,
  getResourcesForVideo,
  showToast,
  onClosePlayer,
}: PlaylistSidebarProps) {
  return (
    <div
      data-lenis-prevent
      className="w-full lg:w-[30%] lg:h-[calc(100vh-76px)] lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-900 bg-slate-950 flex flex-col no-scrollbar z-20"
    >
      {/* Sidebar Header Area */}
      <div className="font-bold text-base text-white p-4 border-b border-slate-900 flex justify-between items-center shrink-0 bg-slate-950/40">
        <div className="flex flex-col">
          <h3 className="text-sm font-poppins font-bold text-white">Course content</h3>
          <span className="text-[10px] text-slate-500 font-light mt-0.5 font-mono">
            {completedLessons.length} / {flatVideosList.length} Lessons completed ({courseCompletionRate}%)
          </span>
        </div>

        {/* Minimal Placeholder cross close button */}
        <button
          onClick={onClosePlayer}
          className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors outline-none"
          title="Close Course Player"
        >
          <ArrowLeft className="size-3.5" />
        </button>
      </div>

      {/* Playlist Accordion Rows */}
      <div
        data-lenis-prevent
        className="flex-1 divide-y divide-slate-900 overflow-y-auto no-scrollbar"
      >
        {syllabus.map((section) => {
          const isSectionExpanded = !!expandedSections[section.id];

          // Count completed in this section
          const secCompleted = section.videos.filter((v) => completedLessons.includes(v.id)).length;
          const secTotal = section.videos.length;

          return (
            <div key={section.id} className="flex flex-col">
              {/* Section Accordion Header */}
              <button
                onClick={() => onToggleSection(section.id)}
                className="w-full text-left p-4 bg-slate-950/20 hover:bg-slate-950/50 flex justify-between items-start gap-3 transition-colors border-none cursor-pointer outline-none group select-none"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors font-poppins leading-normal">
                    {section.title}
                  </h4>
                  <span className="block text-[10px] text-slate-500 font-light font-mono mt-1">
                    {secCompleted} / {secTotal} | {section.duration}
                  </span>
                </div>

                <div className="p-0.5 rounded text-slate-500 group-hover:text-slate-300 transition-colors">
                  {isSectionExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              {/* Accordion Item Panel (List of Videos) */}
              {isSectionExpanded && (
                <div className="bg-slate-950/5 flex flex-col font-light">
                  {section.videos.map((vid) => {
                    const isVideoActive = vid.id === activeVideoId;
                    const isVideoCompleted = completedLessons.includes(vid.id);

                    return (
                      <div
                        key={vid.id}
                        onClick={() => onVideoSelect(vid.id)}
                        className={`p-4 pl-4 flex items-start gap-3.5 border-b border-slate-900/50 cursor-pointer transition-colors select-none ${
                          isVideoActive
                            ? "bg-[#892CDC]/10 border-l-2 border-[#892CDC]"
                            : "hover:bg-white/[0.01] border-l-2 border-transparent"
                        }`}
                      >
                        {/* Checkbox kotak status selesai belajar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteLesson(vid.id);
                          }}
                          className="mt-1.5 p-0 bg-transparent border-none outline-none cursor-pointer shrink-0 transition-transform active:scale-95"
                          title={isVideoCompleted ? "Tandai Belum Selesai" : "Tandai Selesai"}
                        >
                          {isVideoCompleted ? (
                            <div className="size-[18px] rounded bg-[#892CDC] border border-[#892CDC] flex items-center justify-center text-white shadow-md">
                              <svg className="size-3 fill-current" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="size-[18px] rounded border border-slate-700 bg-slate-950 flex items-center justify-center hover:border-[#892CDC] transition-colors" />
                          )}
                        </button>

                        {/* Middle & Right Content: Vertical layout */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          <span
                            className={`block text-sm leading-snug font-medium transition-colors ${
                              isVideoActive ? "text-[#DDA5FF] font-bold" : "text-slate-200 hover:text-white"
                            }`}
                          >
                            {vid.title}
                          </span>

                          <div className="flex items-center justify-between gap-4 mt-0.5">
                            {/* Duration info with Monitor icon */}
                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 font-light">
                              <Monitor className="size-3.5 text-slate-500" />
                              <span>{vid.duration}</span>
                            </span>

                            {/* Resources Nested Dropdown Menu */}
                            {vid.hasResources && (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenResourcesToggle(vid.id);
                                  }}
                                  className={`inline-flex items-center gap-1.5 rounded-lg border border-[#892CDC] text-[#DDA5FF] hover:bg-[#892CDC]/10 px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer outline-none select-none active:scale-95 ${
                                    openResourcesId === vid.id ? "bg-[#892CDC]/15" : ""
                                  }`}
                                >
                                  {openResourcesId === vid.id ? (
                                    <FolderOpen className="size-3.5 text-[#DDA5FF]" />
                                  ) : (
                                    <Folder className="size-3.5 text-[#DDA5FF]" />
                                  )}
                                  <span>Resources</span>
                                  <ChevronDown
                                    className={`size-3 transition-transform duration-200 ${
                                      openResourcesId === vid.id ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>

                                {/* Resources Popover Box */}
                                {openResourcesId === vid.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-200 text-left"
                                  >
                                    <div className="text-[9px] uppercase font-bold text-slate-500 px-2.5 py-1.5 border-b border-[#52057B] mb-1 tracking-wider">
                                      Download Attachments
                                    </div>
                                    <div className="space-y-0.5">
                                      {getResourcesForVideo(vid).map((file, fIdx) => (
                                        <button
                                          key={fIdx}
                                          onClick={() => {
                                            showToast(`Mengunduh/Membuka lampiran: ${file.name}`, "success");
                                            onOpenResourcesToggle(vid.id);
                                          }}
                                          className="w-full text-left hover:bg-slate-800 text-slate-200 text-xs py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer transition-colors bg-transparent border-none outline-none font-light"
                                        >
                                          {file.type === "download" ? (
                                            <Download className="size-3.5 text-[#892CDC] shrink-0" />
                                          ) : (
                                            <ExternalLink className="size-3.5 text-[#FAEB92] shrink-0" />
                                          )}
                                          <span className="truncate">{file.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
