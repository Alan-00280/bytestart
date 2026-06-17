"use client";

import React from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Settings, Maximize2, Minimize2, Sparkles, ArrowLeft } from "lucide-react";
import { Course } from "@/data/coursesMock";

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  hasResources?: boolean;
  resourceName?: string;
}

interface VideoPlayerProps {
  course: Course;
  activeVideo: VideoItem;
  isPlaying: boolean;
  onPlayToggle: () => void;
  currentTime: number;
  progressPercent: number;
  onTimelineClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (sec: number) => string;
  onPrevVideo: () => void;
  onNextVideo: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  showSettingsMenu: boolean;
  setShowSettingsMenu: (show: boolean) => void;
  videoQuality: string;
  setVideoQuality: (q: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function VideoPlayer({
  course,
  activeVideo,
  isPlaying,
  onPlayToggle,
  currentTime,
  progressPercent,
  onTimelineClick,
  formatTime,
  onPrevVideo,
  onNextVideo,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  showSettingsMenu,
  setShowSettingsMenu,
  videoQuality,
  setVideoQuality,
  playbackSpeed,
  setPlaybackSpeed,
  isFullscreen,
  onFullscreenToggle,
  showToast,
}: VideoPlayerProps) {
  return (
    <div
      className={`w-full aspect-video bg-black relative flex flex-col justify-between overflow-hidden group select-none shrink-0 border border-slate-800 rounded-2xl ${
        isFullscreen
          ? "fixed inset-0 w-screen h-screen z-[999] aspect-auto"
          : "sticky top-[76px] lg:relative lg:top-0 z-30"
      }`}
    >
      {/* Mock Video Canvas background */}
      <div className="absolute inset-0 flex items-center justify-center bg-radial from-slate-900 via-neutral-950 to-black overflow-hidden pointer-events-none">
        {/* Animated abstract tech patterns representing video stream */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

        {/* Display Course Image as thumbnail when paused, or visual animation when playing */}
        {!isPlaying ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={course.image}
              alt="Course Thumbnail"
              className="w-full h-full object-cover opacity-50"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
              }}
            />
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] tracking-widest font-mono text-[#FAEB92] uppercase border border-[#FAEB92]/30 px-3 py-1 rounded bg-[#FAEB92]/5 backdrop-blur-sm animate-pulse">
                PAUSED
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="relative size-16">
              {/* Ring animation */}
              <div className="absolute inset-0 border-2 border-[#892CDC] rounded-full animate-ping opacity-25" />
              <div className="absolute inset-0 border border-[#892CDC] rounded-full scale-100 flex items-center justify-center bg-[#892CDC]/10 text-[#DDA5FF]">
                <Sparkles className="size-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h5 className="text-[#DDA5FF] text-sm font-semibold font-poppins px-4 truncate max-w-lg">
                {activeVideo.title}
              </h5>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Streaming at {videoQuality} • Playback Speed {playbackSpeed}x
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Giant Center Play/Pause Indicator */}
      <div
        onClick={onPlayToggle}
        className="absolute inset-0 cursor-pointer flex items-center justify-center z-10"
      >
        <button
          className={`size-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer outline-none shadow-2xl active:scale-95 border ${
            isPlaying
              ? "bg-black/60 hover:bg-[#892CDC]/90 text-white border-white/10 hover:border-[#892CDC] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              : "bg-[#892CDC] hover:bg-[#973fe8] text-white border-[#892CDC] scale-100 shadow-[#892CDC]/30 hover:scale-105 animate-pulse"
          }`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-7 fill-white text-white" />
          ) : (
            <Play className="size-7 fill-white text-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Top Info Bar (Visual Hover state) */}
      <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#FAEB92] uppercase tracking-wider leading-none">
            {course.category}
          </span>
          <span className="text-xs font-semibold text-white mt-1.5 truncate max-w-sm sm:max-w-md">
            {activeVideo.title}
          </span>
        </div>

        <Link
          href="/dashboard/my-learning"
          className="px-3 py-1.5 text-[10px] font-semibold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-1 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="size-3" />
          <span>Exit Player</span>
        </Link>
      </div>

      {/* Bottom Controls Panel */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-3 z-20">
        {/* Timeline Slider bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] font-mono text-slate-400 w-10 shrink-0">
            {formatTime(currentTime)}
          </span>

          <div
            onClick={onTimelineClick}
            className="flex-1 h-1 bg-slate-800 rounded-full cursor-pointer relative group/timeline"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#892CDC] to-[#A156E3] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Handle Dot */}
            <div
              className="absolute size-2.5 rounded-full bg-[#FAEB92] border border-black -translate-x-1/2 -translate-y-[3px] opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-md"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[10px] font-mono text-slate-400 w-10 text-right shrink-0">
            {activeVideo.duration}
          </span>
        </div>

        {/* Action Buttons bar */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Play Button */}
            <button
              onClick={onPlayToggle}
              className="text-white hover:text-[#DDA5FF] transition-colors cursor-pointer bg-transparent border-none outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-4.5 fill-current" />
              ) : (
                <Play className="size-4.5 fill-current" />
              )}
            </button>

            {/* Previous Video */}
            <button
              onClick={onPrevVideo}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none text-xs font-semibold"
              title="Previous Lesson"
            >
              Prev
            </button>

            {/* Next Video */}
            <button
              onClick={onNextVideo}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none text-xs font-semibold"
              title="Next Lesson"
            >
              Next
            </button>

            {/* Mute Button & Volume Slider */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-[#DDA5FF] transition-colors cursor-pointer bg-transparent border-none outline-none"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-4.5" />
                ) : (
                  <Volume2 className="size-4.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#892CDC] outline-none opacity-0 group-hover/volume:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Right controls: Speed, Quality, Fullscreen */}
          <div className="flex items-center gap-4 relative">
            {/* Playback speed selector */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="text-slate-300 hover:text-white text-[11px] font-mono font-bold tracking-wide uppercase transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
              >
                <Settings className="size-4 animate-spin-slow" />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Quality & Speed popover menu */}
              {showSettingsMenu && (
                <div className="absolute right-0 bottom-7 mb-2 w-48 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl z-50">
                  <div className="text-[9px] uppercase font-bold text-slate-500 px-2.5 py-1 border-b border-white/5 mb-1.5 tracking-wider">
                    Video Settings
                  </div>

                  {/* Quality Options */}
                  <div className="space-y-0.5 mb-2">
                    <span className="block text-[8px] uppercase text-slate-400 font-bold px-2.5">
                      Quality
                    </span>
                    {["1080p", "720p", "Auto"].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setVideoQuality(q);
                          showToast(`Resolusi video diubah ke ${q}`, "info");
                        }}
                        className={`w-full text-left px-2.5 py-1 text-[10px] rounded hover:bg-[#892CDC]/25 flex items-center justify-between cursor-pointer bg-transparent border-none text-slate-300 ${
                          videoQuality === q
                            ? "text-[#DDA5FF] font-semibold bg-[#892CDC]/10"
                            : ""
                        }`}
                      >
                        <span>{q}</span>
                        {videoQuality === q && (
                          <span className="size-1.5 rounded-full bg-[#892CDC]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Speed Options */}
                  <div className="space-y-0.5 border-t border-white/5 pt-1.5">
                    <span className="block text-[8px] uppercase text-slate-400 font-bold px-2.5">
                      Speed
                    </span>
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setPlaybackSpeed(s);
                          setShowSettingsMenu(false);
                          showToast(`Kecepatan putar diatur ke ${s}x`, "info");
                        }}
                        className={`w-full text-left px-2.5 py-1 text-[10px] rounded hover:bg-[#892CDC]/25 flex items-center justify-between cursor-pointer bg-transparent border-none text-slate-300 ${
                          playbackSpeed === s
                            ? "text-[#DDA5FF] font-semibold bg-[#892CDC]/10"
                            : ""
                        }`}
                      >
                        <span>{s}x</span>
                        {playbackSpeed === s && (
                          <span className="size-1.5 rounded-full bg-[#892CDC]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={onFullscreenToggle}
              className="text-white hover:text-[#DDA5FF] transition-colors cursor-pointer bg-transparent border-none outline-none"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="size-4.5" />
              ) : (
                <Maximize2 className="size-4.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
