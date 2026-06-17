"use client";

import React, { useState, useEffect, useMemo, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, Course } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

// Import modular subcomponents
import { VideoPlayer, VideoItem } from "./_components/video-player";
import { PlaylistSidebar, SyllabusSection, ResourceFile } from "./_components/playlist-sidebar";
import { OverviewTab } from "./_components/overview-tab";
import { QaTab } from "./_components/qa-tab";
import { NotesTab, NoteItem } from "./_components/notes-tab";
import { AnnouncementsTab } from "./_components/announcements-tab";
import { ReviewsTab } from "./_components/reviews-tab";
import { ToolsTab } from "./_components/tools-tab";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getResourcesForVideo = (vid: VideoItem): ResourceFile[] => {
  const primaryName = vid.resourceName || "source-code.zip";
  return [
    { name: primaryName, type: "download", url: "#" },
    { name: "readme-instructions.txt", type: "download", url: "#" },
    { name: "Official Documentation Link", type: "link", url: "https://example.com" }
  ];
};

export default function CoursePlayerPage({ params }: PageProps) {
  const { id: courseIdStr } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Parse course ID
  const courseId = useMemo(() => {
    return parseInt(courseIdStr, 10) || 1;
  }, [courseIdStr]);

  // Load Course Info
  const course = useMemo(() => {
    return coursesData.find((c) => c.id === courseId) || coursesData[0];
  }, [courseId]);

  // Navigation & Role states
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected Video & Syllabus Syllabus
  const [activeVideoId, setActiveVideoId] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "sec-1": true,
  });
  const [openResourcesId, setOpenResourcesId] = useState<string | null>(null);

  // Completed Lessons (video IDs)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSchedulerWidget, setShowSchedulerWidget] = useState(true);

  // Interaction Mock States
  const [featuredQuestions, setFeaturedQuestions] = useState([
    {
      id: "fq-1",
      avatar: "PB",
      user: "Pradipta Baskara",
      title: "Hydration Mismatch on Next.js 15 Server Components",
      body: "Muncul error hydration mismatch saat merender komponen tanggal statis. Bagaimana penanganan terbaik agar tidak merusak performa SSR?",
      lecture: "Lecture 24",
      time: "2 days ago",
      votes: 166,
      replies: 14,
      isUpvoted: false
    },
    {
      id: "fq-2",
      avatar: "NM",
      user: "Nabila Mutia",
      title: "Zod validation schema for Nested object fields",
      body: "Saya mencoba memvalidasi data form beralamat nested dengan Zod, tapi validasinya selalu mentok di level terluar. Adakah contoh schema-nya?",
      lecture: "Lecture 45",
      time: "1 week ago",
      votes: 85,
      replies: 12,
      isUpvoted: false
    },
    {
      id: "fq-3",
      avatar: "KA",
      user: "Kevin Adrian",
      title: "Deployment to Vercel fails with Turbopack enabled",
      body: "Build lokal dengan Turbopack berjalan lancar, namun saat push deploy ke Vercel terhenti dengan error build step. Mohon arahannya.",
      lecture: "Lecture 12",
      time: "2 weeks ago",
      votes: 54,
      replies: 3,
      isUpvoted: false
    },
    {
      id: "fq-4",
      avatar: "SR",
      user: "Siti Rahma",
      title: "Framer variants layout transition duration",
      body: "Bagaimana mengatur delay transition duration antar variants agar animasi masuk dan keluar tidak bertabrakan?",
      lecture: "Lecture 88",
      time: "3 weeks ago",
      votes: 32,
      replies: 5,
      isUpvoted: false
    }
  ]);

  const [notesList, setNotesList] = useState<NoteItem[]>([
    {
      id: "n-1",
      timestamp: 45,
      timestampStr: "00:45",
      content: "Penting: Next.js 15 default rendering behavior menggunakan static caching untuk page non-dinamis.",
      date: "11 Jun 2026",
    },
    {
      id: "n-2",
      timestamp: 210,
      timestampStr: "03:30",
      content: "Konfigurasi tailwind.config di v4 dialihkan sepenuhnya ke berkas global CSS utama.",
      date: "11 Jun 2026",
    },
  ]);
  const [newNote, setNewNote] = useState("");

  // Announcements Comments State
  const [announcementsComments, setAnnouncementsComments] = useState([
    {
      id: "ac-1",
      avatar: "AP",
      user: "Alif Pratama",
      time: "4 months ago",
      body: "Hey teacher, I was curious to know if you would be updating the course with next 16 stuff (compatible with react 19.2)? Thanks!"
    },
    {
      id: "ac-2",
      avatar: "IL",
      user: "Indra Lesmana",
      time: "4 months ago",
      body: "Thanks Max! The roadmap predictions are incredibly insightful."
    }
  ]);
  const [newAnnouncementComment, setNewAnnouncementComment] = useState("");

  const handleAddAnnouncementComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementComment.trim()) return;
    const comment = {
      id: `ac-${Date.now()}`,
      avatar: "LA",
      user: "Luthfi Alan",
      time: "Just now",
      body: newAnnouncementComment.trim()
    };
    setAnnouncementsComments([comment, ...announcementsComments]);
    setNewAnnouncementComment("");
    showToast("Komentar berhasil ditambahkan!", "success");
  };

  // Student Reviews State
  const [studentReviewsList, setStudentReviewsList] = useState([
    {
      id: "rev-1",
      avatar: "VS",
      user: "Victor Santoso",
      rating: 5,
      time: "5 months ago",
      body: "I wanted to learn a full stack framework and next js is the one i was inclined towards. This course has helped me understand how to build production level applications using NextJs. The instructor explains all details with absolute clarity.",
      helpfulState: null as "up" | "down" | null
    },
    {
      id: "rev-2",
      avatar: "AE",
      user: "Amelia Ekawati",
      rating: 4,
      time: "a month ago",
      body: "Materi Next.js 15 Server Actions sangat detail. Sangat terbantu dengan ZIP source code di setiap section materi. Semoga ditambahkan bonus section tentang deployment ke Docker.",
      helpfulState: null as "up" | "down" | null
    }
  ]);

  const handleVoteReview = (revId: string, type: "up" | "down") => {
    setStudentReviewsList((prev) =>
      prev.map((rev) => {
        if (rev.id === revId) {
          const isSame = rev.helpfulState === type;
          const newState = isSame ? null : type;
          showToast(isSame ? "Batal memilih" : `Membantu: ${type === "up" ? "Ya" : "Tidak"}`, "success");
          return { ...rev, helpfulState: newState };
        }
        return rev;
      })
    );
  };

  // Refs for custom video player fullscreen mode
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate Syllabus based on Course ID
  const syllabus: SyllabusSection[] = useMemo(() => {
    // Standard static syllabi for the 3 courses
    if (courseId === 1) {
      return [
        {
          id: "sec-1",
          title: "Section 1: Introduction & App Setup",
          duration: "35min",
          videos: [
            { id: "c1-v1", title: "1. Course Introduction", duration: "05:12", durationSeconds: 312 },
            { id: "c1-v2", title: "2. Setting up Next.js 15 with Turbopack", duration: "10:45", durationSeconds: 645 },
            { id: "c1-v3", title: "3. Project File Structure & App Router basics", duration: "12:15", durationSeconds: 735 },
            { id: "c1-v4", title: "4. Configuring Tailwind CSS v4", duration: "08:30", durationSeconds: 510, hasResources: true, resourceName: "global-css-theme.zip" },
          ],
        },
        {
          id: "sec-2",
          title: "Section 2: Server-First Rendering & Caching",
          duration: "52min",
          videos: [
            { id: "c1-v5", title: "5. Server vs Client Components Architecture", duration: "12:40", durationSeconds: 760 },
            { id: "c1-v6", title: "6. Data Fetching in Server Components", duration: "15:20", durationSeconds: 920 },
            { id: "c1-v7", title: "7. Caching Mechanics & Revalidation", duration: "14:10", durationSeconds: 850 },
            { id: "c1-v8", title: "8. Dynamic vs Static Rendering modes", duration: "06:30", durationSeconds: 390 },
            { id: "c1-v9", title: "9. Route Handlers & REST APIs", duration: "05:15", durationSeconds: 315, hasResources: true, resourceName: "api-route-sample.ts" },
          ],
        },
        {
          id: "sec-3",
          title: "Section 3: State Management & Forms",
          duration: "45min",
          videos: [
            { id: "c1-v10", title: "10. React Server Actions core features", duration: "15:10", durationSeconds: 910 },
            { id: "c1-v11", title: "11. Optimistic Updates with useOptimistic", duration: "10:25", durationSeconds: 625 },
            { id: "c1-v12", title: "12. Form State & Validation with Zod", duration: "12:45", durationSeconds: 765 },
            { id: "c1-v13", title: "13. Practical Checkout Form Simulation", duration: "08:50", durationSeconds: 530, hasResources: true, resourceName: "checkout-action-zod.zip" },
          ],
        },
      ];
    } else if (courseId === 2) {
      return [
        {
          id: "sec-1",
          title: "Section 1: Framer Basics",
          duration: "25min",
          videos: [
            { id: "c2-v1", title: "1. What is Framer and Why Use It?", duration: "06:12", durationSeconds: 372 },
            { id: "c2-v2", title: "2. Exploring the Framer Canvas and UI", duration: "09:40", durationSeconds: 580 },
            { id: "c2-v3", title: "3. Creating Your First Layout Grid", duration: "10:05", durationSeconds: 605, hasResources: true, resourceName: "first-layout-framer.zip" },
          ],
        },
        {
          id: "sec-2",
          title: "Section 2: Animations and Motion",
          duration: "42min",
          videos: [
            { id: "c2-v4", title: "4. Framer Motion Principles", duration: "10:15", durationSeconds: 615 },
            { id: "c2-v5", title: "5. Hover and Tap Gestures", duration: "08:30", durationSeconds: 510 },
            { id: "c2-v6", title: "6. Scroll-linked and Scroll-triggered animations", duration: "14:20", durationSeconds: 860 },
            { id: "c2-v7", title: "7. Component Variants & Transitions", duration: "10:45", durationSeconds: 645, hasResources: true, resourceName: "variants-code.ts" },
          ],
        },
      ];
    } else if (courseId === 11) {
      return [
        {
          id: "sec-1",
          title: "Section 1: Tailwind v4 Core Concepts",
          duration: "30min",
          videos: [
            { id: "c11-v1", title: "1. Introducing Tailwind CSS v4 Engine", duration: "08:15", durationSeconds: 495 },
            { id: "c11-v2", title: "2. CSS-First Configuration Setup", duration: "10:30", durationSeconds: 630 },
            { id: "c11-v3", title: "3. Utility-First Workflow in 2026", duration: "12:10", durationSeconds: 730, hasResources: true, resourceName: "utility-setup-demo.zip" },
          ],
        },
        {
          id: "sec-2",
          title: "Section 2: Creative Layouts & Forms",
          duration: "45min",
          videos: [
            { id: "c11-v4", title: "4. Advanced Flexbox & Grids configurations", duration: "12:20", durationSeconds: 740 },
            { id: "c11-v5", title: "5. Responsive Design Principles", duration: "10:15", durationSeconds: 615 },
            { id: "c11-v6", title: "6. Styling Form elements nicely", duration: "13:40", durationSeconds: 820 },
            { id: "c11-v7", title: "7. UI Polish: Transitions & Shadows", duration: "10:15", durationSeconds: 615, hasResources: true, resourceName: "shadows-utility-presets.css" },
          ],
        },
      ];
    }

    // Default dynamic fallback syllabus for other IDs
    return [
      {
        id: "sec-1",
        title: "Section 1: Getting Started",
        duration: "28min",
        videos: [
          { id: `c${courseId}-v1`, title: "1. Welcome & Setup Basics", duration: "07:15", durationSeconds: 435 },
          { id: `c${courseId}-v2`, title: "2. Core Principles & Architecture Overview", duration: "11:20", durationSeconds: 680 },
          { id: `c${courseId}-v3`, title: "3. First Project Initialization", duration: "09:40", durationSeconds: 580, hasResources: true, resourceName: "init-code-structure.zip" },
        ],
      },
      {
        id: "sec-2",
        title: "Section 2: Practical Coding Exercises",
        duration: "34min",
        videos: [
          { id: `c${courseId}-v4`, title: "4. Implementation and Logic flow", duration: "10:15", durationSeconds: 615 },
          { id: `c${courseId}-v5`, title: "5. Troubleshooting & Debugging", duration: "13:10", durationSeconds: 790 },
          { id: `c${courseId}-v6`, title: "6. Deployment and Production optimization", duration: "10:50", durationSeconds: 650, hasResources: true, resourceName: "prod-deploy-checklist.md" },
        ],
      },
    ];
  }, [courseId]);

  // Flatten videos list for easy next/prev seeking
  const flatVideosList = useMemo(() => {
    return syllabus.flatMap((sec) => sec.videos);
  }, [syllabus]);

  // Active Video details
  const activeVideo = useMemo(() => {
    return flatVideosList.find((v) => v.id === activeVideoId) || flatVideosList[0];
  }, [flatVideosList, activeVideoId]);

  // Initial setup on mount
  useEffect(() => {
    setMounted(true);

    // Set first video active
    if (flatVideosList.length > 0) {
      setActiveVideoId(flatVideosList[0].id);
    }

    // Load completed lessons from localStorage
    const savedCompleted = localStorage.getItem(`bytestart_completed_${courseId}`);
    if (savedCompleted) {
      try {
        setCompletedLessons(JSON.parse(savedCompleted));
      } catch (e) {}
    } else {
      // default: pre-check the first lesson to simulate progress
      if (flatVideosList.length > 0) {
        const initialCompleted = [flatVideosList[0].id];
        setCompletedLessons(initialCompleted);
        localStorage.setItem(`bytestart_completed_${courseId}`, JSON.stringify(initialCompleted));
      }
    }
  }, [courseId, flatVideosList]);

  // Simulate Timer interval when playing
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= activeVideo.durationSeconds) {
            // Auto complete lesson and go next or stop
            setIsPlaying(false);
            handleCompleteLesson(activeVideo.id, true);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPlaying, activeVideo]);

  // Format seconds to MM:SS
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toast utility
  const showToast = (text: string, type: "success" | "info" | "role" = "success") => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  const handleCloseToast = (toastId: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  // Toggle lesson complete check
  const handleCompleteLesson = (videoId: string, isAuto = false) => {
    let updated: string[] = [];
    if (completedLessons.includes(videoId)) {
      if (!isAuto) {
        updated = completedLessons.filter((id) => id !== videoId);
        showToast("Materi ditandai belum selesai", "info");
      } else {
        updated = [...completedLessons];
      }
    } else {
      updated = [...completedLessons, videoId];
      const foundVideo = flatVideosList.find((v) => v.id === videoId);
      showToast(`Selesai! "${foundVideo?.title || ""}" telah diselesaikan.`, "success");
    }
    setCompletedLessons(updated);
    localStorage.setItem(`bytestart_completed_${courseId}`, JSON.stringify(updated));

    // Update global progress in course list for dashboard
    const savedProgress = localStorage.getItem("bytestart_course_progress");
    if (savedProgress) {
      try {
        const progressMap = JSON.parse(savedProgress);
        if (progressMap[courseId]) {
          const totalVideos = flatVideosList.length;
          const completedCount = updated.length;
          const percentage = Math.round((completedCount / totalVideos) * 100);
          
          progressMap[courseId] = {
            ...progressMap[courseId],
            progress: percentage
          };
          localStorage.setItem("bytestart_course_progress", JSON.stringify(progressMap));
        }
      } catch (e) {}
    }
  };

  // Video Progress Percent helper
  const progressPercent = useMemo(() => {
    if (!activeVideo.durationSeconds) return 0;
    return (currentTime / activeVideo.durationSeconds) * 100;
  }, [currentTime, activeVideo]);

  // Click on Timeline
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = clickRatio * activeVideo.durationSeconds;
    setCurrentTime(Math.floor(targetSec));
  };

  // Complete Percent of Course
  const courseCompletionRate = useMemo(() => {
    if (flatVideosList.length === 0) return 0;
    return Math.round((completedLessons.length / flatVideosList.length) * 100);
  }, [completedLessons, flatVideosList]);

  // Handle Play/Pause Trigger
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  // Change Active Video
  const handleVideoSelect = (videoId: string) => {
    if (videoId === activeVideoId) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveVideoId(videoId);
    const selectedVideo = flatVideosList.find((v) => v.id === videoId);
    showToast(`Memutar: ${selectedVideo?.title}`, "info");
  };

  // Toggle Accordion Section
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle Upvote Question in Q&A Forum
  const handleUpvoteQuestion = (qId: string) => {
    setFeaturedQuestions((prev) =>
      prev.map((fq) => {
        if (fq.id === qId) {
          const upvoted = !fq.isUpvoted;
          const votesDiff = upvoted ? 1 : -1;
          showToast(upvoted ? "Diskusi di-upvote!" : "Upvote dibatalkan", "success");
          return {
            ...fq,
            votes: fq.votes + votesDiff,
            isUpvoted: upvoted
          };
        }
        return fq;
      })
    );
  };

  // Handle Save Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: NoteItem = {
      id: `n-${Date.now()}`,
      timestamp: currentTime,
      timestampStr: formatTime(currentTime),
      content: newNote.trim(),
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };

    setNotesList((prev) => [note, ...prev].sort((a, b) => a.timestamp - b.timestamp));
    setNewNote("");
    showToast(`Catatan disimpan pada menit ${formatTime(currentTime)}`, "success");
  };

  // Handle Click Note Timestamp
  const handleNoteSeek = (timestamp: number) => {
    setCurrentTime(timestamp);
    setIsPlaying(true);
    showToast(`Melompat ke menit ${formatTime(timestamp)}`, "info");
  };

  // Delete Note
  const handleDeleteNote = (noteId: string) => {
    setNotesList((prev) => prev.filter((n) => n.id !== noteId));
    showToast("Catatan dihapus", "info");
  };

  // Play next video
  const handleNextVideo = () => {
    const currentIndex = flatVideosList.findIndex((v) => v.id === activeVideoId);
    if (currentIndex < flatVideosList.length - 1) {
      handleVideoSelect(flatVideosList[currentIndex + 1].id);
    } else {
      showToast("Anda telah berada di video terakhir dari kursus ini!", "info");
    }
  };

  // Play previous video
  const handlePrevVideo = () => {
    const currentIndex = flatVideosList.findIndex((v) => v.id === activeVideoId);
    if (currentIndex > 0) {
      handleVideoSelect(flatVideosList[currentIndex - 1].id);
    } else {
      showToast("Ini adalah video pertama dalam daftar.", "info");
    }
  };

  // Handle Role Switching from Navbar
  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  // Toggle fullscreen mode mockup
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      showToast("Simulator Fullscreen Diaktifkan (Tekan ESC / tombol perkecil untuk keluar)", "info");
    } else {
      setIsFullscreen(false);
    }
  };

  // Escape key to exit fullscreen mockup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  if (!mounted) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#892CDC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen lg:h-screen lg:overflow-hidden text-white antialiased flex flex-col font-sans selection:bg-[#A156E3]/30">
      
      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* VIEWPORT CONTROLLER WRAPPER (Split 2-Column Desktop View) */}
      <div className="flex flex-col lg:flex-row w-full lg:min-h-0 lg:h-[calc(100vh-76px)] bg-slate-950 relative z-10">
        
        {/* KOLOM KIRI: Main Learning Content Area (Lebar: ~70%) */}
        <div 
          data-lenis-prevent
          className={`w-full ${isFullscreen ? "lg:w-full" : "lg:w-[70%]"} lg:h-[calc(100vh-76px)] lg:overflow-y-auto flex flex-col bg-slate-950 no-scrollbar`}
        >
          
          {/* Breadcrumb Navigation on top of Video (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-950 border-b border-slate-900 px-6 py-2.5 shrink-0 z-20">
            <Link href="/dashboard/my-learning" className="hover:text-white transition-colors">My learning</Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-400 font-semibold truncate max-w-[200px]">{course.title}</span>
            <ChevronRight className="size-3" />
            <span className="text-[#DDA5FF] font-medium truncate max-w-[150px]">{activeVideo.title}</span>
          </div>

          {/* Render Video Player component */}
          <VideoPlayer
            course={course}
            activeVideo={activeVideo}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            currentTime={currentTime}
            progressPercent={progressPercent}
            onTimelineClick={handleTimelineClick}
            formatTime={formatTime}
            onPrevVideo={handlePrevVideo}
            onNextVideo={handleNextVideo}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            volume={volume}
            setVolume={setVolume}
            showSettingsMenu={showSettingsMenu}
            setShowSettingsMenu={setShowSettingsMenu}
            videoQuality={videoQuality}
            setVideoQuality={setVideoQuality}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
            showToast={showToast}
          />

          {/* 2. Tabs Navigation Menu (Tengah) */}
          <div className="border-b border-slate-900 bg-slate-950 px-6 py-1 shrink-0 z-20 sticky top-[calc(76px+56.25vw)] lg:relative lg:top-0">
            <div className="flex overflow-x-auto no-scrollbar gap-6 text-sm font-semibold text-slate-400 py-2" style={{ scrollbarWidth: "none" }}>
              {[
                { id: "overview", name: "Overview" },
                { id: "qa", name: "Q&A" },
                { id: "notes", name: "Notes" },
                { id: "announcements", name: "Announcements" },
                { id: "reviews", name: "Reviews" },
                { id: "tools", name: "Learning tools" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer pb-1.5 border-b-2 font-poppins transition-all outline-none whitespace-nowrap ${
                      isActive 
                        ? "border-[#892CDC] text-white font-bold" 
                        : "border-transparent hover:text-slate-200"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tab Content Prose Panel (Bawah) */}
          <div className="flex-1 px-6 py-8 space-y-6">
            
            {activeTab === "overview" && (
              <OverviewTab
                course={course}
                courseCompletionRate={courseCompletionRate}
                showSchedulerWidget={showSchedulerWidget}
                setShowSchedulerWidget={setShowSchedulerWidget}
                showFullDescription={showFullDescription}
                setShowFullDescription={setShowFullDescription}
                showToast={showToast}
              />
            )}

            {activeTab === "qa" && (
              <QaTab
                featuredQuestions={featuredQuestions}
                onUpvoteQuestion={handleUpvoteQuestion}
                showToast={showToast}
              />
            )}

            {activeTab === "notes" && (
              <NotesTab
                currentTime={currentTime}
                notesList={notesList}
                newNote={newNote}
                onNewNoteChange={setNewNote}
                onSaveNote={handleSaveNote}
                onNoteSeek={handleNoteSeek}
                onDeleteNote={handleDeleteNote}
                formatTime={formatTime}
              />
            )}

            {activeTab === "announcements" && (
              <AnnouncementsTab
                announcementsComments={announcementsComments}
                newAnnouncementComment={newAnnouncementComment}
                onCommentChange={setNewAnnouncementComment}
                onAddComment={handleAddAnnouncementComment}
                showToast={showToast}
              />
            )}

            {activeTab === "reviews" && (
              <ReviewsTab
                studentReviewsList={studentReviewsList}
                onVoteReview={handleVoteReview}
                showToast={showToast}
              />
            )}

            {activeTab === "tools" && (
              <ToolsTab showToast={showToast} />
            )}

            {/* Scrollable Left Column Footer */}
            <div className="pt-10 mt-12 border-t border-slate-900 shrink-0">
              <Footer />
            </div>

          </div>

        </div>

        {/* KOLOM KANAN: Course Content & Playlist Sidebar (Lebar: ~30% Desktop) */}
        {!isFullscreen && (
          <PlaylistSidebar
            syllabus={syllabus}
            completedLessons={completedLessons}
            flatVideosList={flatVideosList}
            activeVideoId={activeVideoId}
            courseCompletionRate={courseCompletionRate}
            expandedSections={expandedSections}
            openResourcesId={openResourcesId}
            onToggleSection={toggleSection}
            onVideoSelect={handleVideoSelect}
            onCompleteLesson={handleCompleteLesson}
            onOpenResourcesToggle={(vidId) => setOpenResourcesId(openResourcesId === vidId ? null : vidId)}
            getResourcesForVideo={getResourcesForVideo}
            showToast={showToast}
            onClosePlayer={() => router.push("/dashboard/my-learning")}
          />
        )}

      </div>

      {/* TOAST NOTIFICATION CONTAINER */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

    </div>
  );
}
