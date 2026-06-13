"use client";

import React, { useState, useEffect, useMemo, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square, 
  FileText, 
  Star, 
  Award, 
  MessageSquare, 
  Sparkles, 
  ArrowLeft,
  Clock,
  Send,
  Plus,
  Paperclip,
  Trash2,
  Calendar,
  Compass,
  AlertCircle,
  Folder,
  FolderOpen,
  ExternalLink,
  Monitor,
  Download,
  ArrowUpCircle,
  Search,
  Flag,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, Course } from "@/data/coursesMock";

interface PageProps {
  params: Promise<{ id: string }>;
}

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

interface QaItem {
  id: string;
  user: string;
  avatar: string;
  time: string;
  question: string;
  replies: number;
}

interface NoteItem {
  id: string;
  timestamp: number; // in seconds
  timestampStr: string;
  content: string;
  date: string;
}

interface ResourceFile {
  name: string;
  type: "download" | "link";
  url: string;
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
  const [currentRole, setCurrentRole] = useState("public");
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

    const savedRole = localStorage.getItem("bytestart_role");
    if (savedRole) {
      setCurrentRole(savedRole);
    } else {
      // For dashboard/my-learning, default is student if not set
      setCurrentRole("student");
      localStorage.setItem("bytestart_role", "student");
    }

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
    localStorage.setItem("bytestart_role", roleId);
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
          className="w-full lg:w-[70%] lg:h-[calc(100vh-76px)] lg:overflow-y-auto flex flex-col bg-slate-950 no-scrollbar"
        >
          
          {/* Breadcrumb Navigation on top of Video (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-950 border-b border-slate-900 px-6 py-2.5 shrink-0 z-20">
            <Link href="/dashboard/my-learning" className="hover:text-white transition-colors">My learning</Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-400 font-semibold truncate max-w-[200px]">{course.title}</span>
            <ChevronRight className="size-3" />
            <span className="text-[#DDA5FF] font-medium truncate max-w-[150px]">{activeVideo.title}</span>
          </div>

          {/* 1. Video Player Container (Aspect Video) */}
          <div 
            ref={playerContainerRef}
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
              onClick={handlePlayToggle}
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
                {isPlaying ? <Pause className="size-7 fill-white text-white" /> : <Play className="size-7 fill-white text-white translate-x-0.5" />}
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
              
              {/* Timeline Progress Bar */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-[10px] font-mono text-slate-400 w-10 shrink-0">
                  {formatTime(currentTime)}
                </span>
                
                {/* Horizontal slider bar */}
                <div 
                  onClick={handleTimelineClick}
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
                    onClick={handlePlayToggle}
                    className="text-white hover:text-[#DDA5FF] transition-colors cursor-pointer bg-transparent border-none outline-none"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="size-4.5 fill-current" /> : <Play className="size-4.5 fill-current" />}
                  </button>

                  {/* Previous Video */}
                  <button 
                    onClick={handlePrevVideo}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none text-xs font-semibold"
                    title="Previous Lesson"
                  >
                    Prev
                  </button>

                  {/* Next Video */}
                  <button 
                    onClick={handleNextVideo}
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
                      {isMuted || volume === 0 ? <VolumeX className="size-4.5" /> : <Volume2 className="size-4.5" />}
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
                          <span className="block text-[8px] uppercase text-slate-400 font-bold px-2.5">Quality</span>
                          {["1080p", "720p", "Auto"].map((q) => (
                            <button
                              key={q}
                              onClick={() => {
                                setVideoQuality(q);
                                showToast(`Resolusi video diubah ke ${q}`, "info");
                              }}
                              className={`w-full text-left px-2.5 py-1 text-[10px] rounded hover:bg-[#892CDC]/25 flex items-center justify-between cursor-pointer bg-transparent border-none text-slate-300 ${
                                videoQuality === q ? "text-[#DDA5FF] font-semibold bg-[#892CDC]/10" : ""
                              }`}
                            >
                              <span>{q}</span>
                              {videoQuality === q && <span className="size-1.5 rounded-full bg-[#892CDC]" />}
                            </button>
                          ))}
                        </div>

                        {/* Speed Options */}
                        <div className="space-y-0.5 border-t border-white/5 pt-1.5">
                          <span className="block text-[8px] uppercase text-slate-400 font-bold px-2.5">Speed</span>
                          {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setPlaybackSpeed(s);
                                setShowSettingsMenu(false);
                                showToast(`Kecepatan putar diatur ke ${s}x`, "info");
                              }}
                              className={`w-full text-left px-2.5 py-1 text-[10px] rounded hover:bg-[#892CDC]/25 flex items-center justify-between cursor-pointer bg-transparent border-none text-slate-300 ${
                                playbackSpeed === s ? "text-[#DDA5FF] font-semibold bg-[#892CDC]/10" : ""
                              }`}
                            >
                              <span>{s}x</span>
                              {playbackSpeed === s && <span className="size-1.5 rounded-full bg-[#892CDC]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button 
                    onClick={handleFullscreenToggle}
                    className="text-white hover:text-[#DDA5FF] transition-colors cursor-pointer bg-transparent border-none outline-none"
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="size-4.5" /> : <Maximize2 className="size-4.5" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

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

          {/* 3. Tab Content Prose Panel (Bawah) - Scrollable independently */}
          <div className="flex-1 px-6 py-8 space-y-6">
            
            {/* OVERVIEW TAB CONTENT */}
            {activeTab === "overview" && (
              <div className="max-w-4xl text-slate-300 space-y-2">
                
                {/* Course Metadata Header */}
                <div className="pb-6 border-b border-slate-800">
                  <h2 className="text-2xl font-bold font-poppins text-white leading-tight mb-3">
                    {course.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Level */}
                    <span className="bg-[#892CDC]/15 border border-[#892CDC]/25 text-[#DDA5FF] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                      {course.level}
                    </span>
                    
                    {/* Star ratings */}
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-[#FAEB92] stroke-[#FAEB92]" />
                      <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
                      <span className="text-slate-500 font-light">({course.reviewsCount} reviews)</span>
                    </div>

                    <div className="text-slate-500">•</div>
                    
                    <div className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="size-3.5 text-slate-500" />
                      <span>{course.duration} total duration</span>
                    </div>

                    <div className="text-slate-500">•</div>

                    <div className="text-slate-300">
                      Progress: <span className="font-bold text-[#FAEB92]">{courseCompletionRate}% Completed</span>
                    </div>
                  </div>
                </div>

                {/* 🌟 Section 1: Widget Jadwal Belajar ("Schedule learning time") */}
                {showSchedulerWidget && (
                  <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/10 mt-6 relative overflow-hidden flex flex-col gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-[#892CDC]/10 border border-[#892CDC]/25 text-[#DDA5FF] flex items-center justify-center shrink-0">
                        <Clock className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-base text-white font-poppins">
                          Schedule learning time
                        </h4>
                        <p className="text-xs text-slate-400 font-light leading-relaxed max-w-3xl">
                          Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-1 sm:pl-14">
                      <button
                        onClick={() => showToast("Membuka setelan jadwal belajar (Simulasi)", "success")}
                        className="px-5 py-2 h-9 rounded-xl border border-[#892CDC] hover:bg-[#892CDC]/15 text-xs font-bold text-white transition-all cursor-pointer outline-none bg-transparent active:scale-95"
                      >
                        Get started
                      </button>
                      <button
                        onClick={() => {
                          setShowSchedulerWidget(false);
                          showToast("Widget jadwal belajar disembunyikan", "info");
                        }}
                        className="px-4 py-2 h-9 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-none outline-none"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* 🌟 Section 2: Statistik Kursus (By the numbers) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800">
                  <div className="text-sm text-slate-400 font-medium w-32 shrink-0">
                    By the numbers
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-2.5 text-sm text-slate-200">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Skill level: All Levels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Students: 158749</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Languages: English</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Captions: Yes</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Lectures: 452</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>Video: 40.5 total hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 Section 3: Sertifikat Kelulusan (Certificates) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800 items-start sm:items-center">
                  <div className="text-sm text-slate-400 font-medium w-32 shrink-0">
                    Certificates
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-slate-300 font-light">
                      Get ByteStart certificate by completing entire course
                    </p>
                    <button
                      onClick={() => {
                        if (courseCompletionRate === 100) {
                          showToast("Mengunduh sertifikat resmi ByteStart...", "success");
                        } else {
                          showToast(`Progres Anda masih ${courseCompletionRate}%. Selesaikan seluruh video untuk membuka sertifikat.`, "info");
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-300 hover:text-[#892CDC] hover:border-[#892CDC]/50 bg-transparent transition-all cursor-pointer outline-none active:scale-95"
                    >
                      ByteStart certificate
                    </button>
                  </div>
                </div>

                {/* 🌟 Section 4: Akses Fitur (Features) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 border-b border-slate-800 items-start sm:items-center">
                  <div className="text-sm text-slate-400 font-medium w-32 shrink-0">
                    Features
                  </div>
                  <div className="flex-1 text-sm text-slate-300">
                    <span>Available on </span>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); showToast("Mengalihkan ke App Store iOS (Simulasi)", "info"); }}
                      className="text-[#892CDC] underline hover:text-[#973fe8] font-semibold transition-colors decoration-slate-700"
                    >
                      iOS
                    </a>
                    <span> and </span>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); showToast("Mengalihkan ke Play Store Android (Simulasi)", "info"); }}
                      className="text-[#892CDC] underline hover:text-[#973fe8] font-semibold transition-colors decoration-slate-700"
                    >
                      Android
                    </a>
                  </div>
                </div>

                {/* 🌟 Section 5: Deskripsi Detail Materi (Description) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-24 py-6 items-start">
                  <div className="text-sm text-slate-400 font-medium w-32 shrink-0">
                    Description
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="text-sm text-slate-400 font-light leading-relaxed space-y-3">
                      <p>
                        Welcome to this comprehensive course designed for developers of all skill levels. In this masterclass, we will study the <strong>latest version of Next.js</strong>, diving deep into advanced architectures like server-side rendering, static site generation, and state management frameworks.
                      </p>
                      
                      {showFullDescription ? (
                        <div className="space-y-3 animate-in fade-in duration-300">
                          <p>
                            We will explore everything from setting up dynamic routing in the new <strong>App Router</strong> to migrating older systems built using the legacy <strong>Pages Router</strong>. You will also learn how to configure Tailwind CSS v4, utilize React Server Actions, and build fully production-ready apps with high-fidelity UI components.
                          </p>
                          <p>
                            This course includes practical code labs, real-world checkout integrations, personal notes, and direct access to ZIP files for each module. Selesaikan seluruh silabus untuk membuka sertifikat digital resmi Anda.
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">...</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-xs font-bold text-[#892CDC] hover:text-[#973fe8] inline-flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none mt-2 transition-all active:scale-95"
                    >
                      <span>{showFullDescription ? "Show less" : "Show more"}</span>
                      {showFullDescription ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Q&A TAB CONTENT */}
            {activeTab === "qa" && (
              <div className="max-w-4xl text-slate-300 space-y-6">
                
                {/* 🌟 Section 1: AI Assistant Prompt Banner (Top Area) */}
                <div className="border border-purple-500/30 rounded-2xl p-4 bg-purple-950/20 flex justify-between items-center mb-6">
                  <div className="flex gap-3 items-center">
                    <Sparkles className="size-5 text-[#892CDC] shrink-0 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        Get an instant answer from the assistant
                      </h4>
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
                      <div 
                        key={fq.id} 
                        className="flex gap-4 items-start pt-6 first:pt-0"
                      >
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
                          <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                            {fq.body}
                          </p>
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
                            onClick={() => handleUpvoteQuestion(fq.id)}
                            className="flex items-center gap-1.5 hover:text-[#FAEB92] transition-colors cursor-pointer group bg-transparent border-none outline-none p-0"
                            title="Upvote"
                          >
                            <span className={`text-xs font-mono font-bold ${fq.isUpvoted ? "text-[#FAEB92]" : "text-slate-300"}`}>
                              {fq.votes}
                            </span>
                            <ArrowUpCircle 
                              className={`size-5 transition-colors ${
                                fq.isUpvoted ? "text-[#FAEB92] fill-[#FAEB92]/20" : "text-slate-500 group-hover:text-[#FAEB92]"
                              }`}
                            />
                          </button>

                          {/* Comment Tracker */}
                          <button 
                            onClick={() => showToast("Membuka balasan forum (Simulasi)", "info")}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-[#892CDC] cursor-pointer transition-colors bg-transparent border-none p-0 outline-none"
                            title="Replies"
                          >
                            <span className="text-xs font-mono font-bold text-slate-300">
                              {fq.replies}
                            </span>
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
            )}

            {/* NOTES TAB CONTENT */}
            {activeTab === "notes" && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-poppins">
                    Personal Learning Notes
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                    Active Video Timestamp: <span className="text-[#FAEB92] font-bold">{formatTime(currentTime)}</span>
                  </div>
                </div>

                {/* New Note Form */}
                <form onSubmit={handleSaveNote} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-md">
                  <span className="block text-xs font-semibold text-slate-300">
                    Catatan otomatis akan ter-link ke menit <strong className="text-[#FAEB92]">{formatTime(currentTime)}</strong>:
                  </span>
                  <textarea
                    rows={2}
                    placeholder="Tulis ringkasan penting atau reminder code di sini..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#892CDC]/50 transition-colors"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="h-8 px-4 bg-[#892CDC] hover:bg-[#973fe8] disabled:opacity-40 disabled:hover:bg-[#892CDC] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer outline-none border-none transition-all"
                    >
                      <Plus className="size-3.5" />
                      <span>Simpan Catatan di {formatTime(currentTime)}</span>
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-3">
                  {notesList.length === 0 ? (
                    <div className="text-center py-8 bg-white/[0.01] border border-white/5 rounded-xl">
                      <FileText className="size-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-light">Belum ada catatan yang disimpan untuk video ini.</p>
                    </div>
                  ) : (
                    notesList.map((note) => (
                      <div key={note.id} className="border border-white/5 rounded-xl p-4 bg-white/[0.01] flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleNoteSeek(note.timestamp)}
                            className="bg-[#892CDC]/15 border border-[#892CDC]/35 hover:bg-[#892CDC]/25 text-[#DDA5FF] text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer outline-none font-mono flex items-center gap-1.5 transition-colors"
                            title="Lompat ke video menit ini"
                          >
                            <Clock className="size-3" />
                            <span>Menit {note.timestampStr}</span>
                          </button>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-light font-mono">{note.date}</span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
                              title="Hapus catatan"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* ANNOUNCEMENTS TAB CONTENT */}
            {activeTab === "announcements" && (
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
                    Hi Everyone! It's a new year and obviously an extremely dynamic world - especially for us developers. 
                    In 2026, web frameworks have matured significantly, React 19 is fully integrated, and Next.js 15 is the absolute production standard. 
                    Here are my main predictions for frontend engineering this year.
                  </p>
                  <p>
                    We will see Turbopack completely overtaking Webpack in all major apps, React Server Actions handling 90% of basic form submissions securely without API routes, and styling configurations shifting towards CSS-first layouts like Tailwind CSS v4.
                  </p>
                  <p>
                    You can read more about Next.js 15 roadmap in the{" "}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); showToast("Mengalihkan ke dokumentasi Next.js...", "info"); }}
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
                  <form onSubmit={handleAddAnnouncementComment} className="flex-1 flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={newAnnouncementComment}
                      onChange={(e) => setNewAnnouncementComment(e.target.value)}
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
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* REVIEWS TAB CONTENT */}
            {activeTab === "reviews" && (
              <div className="max-w-4xl text-slate-300 space-y-6">
                
                {/* 🌟 Section 1: Ringkasan Nilai Kursus (Student Feedback Breakdown) */}
                <div className="flex flex-col md:flex-row items-center gap-10 mb-8 pt-4">
                  {/* Sisi Kiri (Big Rating Display) */}
                  <div className="text-center md:border-r border-slate-800 md:pr-10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-5xl font-black text-[#FAEB92] mb-2">4.7</span>
                    <div className="flex gap-0.5 my-1.5 justify-center">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="size-4 fill-[#FAEB92] stroke-[#FAEB92]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1">Course Rating</span>
                  </div>
                  
                  {/* Sisi Ranan (Distribution Progress Bars - Flex-1) */}
                  <div className="flex-1 w-full flex flex-col justify-center space-y-2 text-xs">
                    {[
                      { stars: 5, pct: 70 },
                      { stars: 4, pct: 24 },
                      { stars: 3, pct: 4 },
                      { stars: 2, pct: 1 },
                      { stars: 1, pct: 1 },
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-4">
                        {/* Linear Bar */}
                        <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden relative">
                          <div className="bg-[#892CDC] h-full rounded-full transition-all duration-500" style={{ width: `${row.pct}%` }} />
                        </div>
                        {/* Stars Indicator */}
                        <div className="flex items-center gap-0.5 shrink-0 w-[72px] justify-end">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star 
                              key={sIdx} 
                              className={`size-3 ${
                                sIdx < row.stars 
                                  ? "fill-[#FAEB92] stroke-[#FAEB92]" 
                                  : "text-slate-700 fill-transparent"
                              }`} 
                            />
                          ))}
                        </div>
                        {/* Percentage Link */}
                        <button
                          onClick={() => showToast(`Menyaring ulasan bintang ${row.stars}...`, "info")}
                          className="w-10 text-right font-mono font-bold text-[#892CDC] hover:text-purple-400 transition cursor-pointer bg-transparent border-none p-0 outline-none text-xs"
                        >
                          {row.pct}%
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 Section 2: Search Reviews & Filter Control Bar (Middle Area 1) */}
                <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 w-full">
                  {/* Search Input & Button Row */}
                  <div className="flex gap-0 items-center w-full max-w-xl">
                    <input 
                      type="text" 
                      placeholder="Search reviews"
                      className="flex-1 bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#892CDC]/50 transition-colors"
                    />
                    <button 
                      onClick={() => showToast("Mencari ulasan...", "info")}
                      className="w-10 bg-[#892CDC] hover:bg-[#973fe8] rounded-r-xl flex items-center justify-center border-none text-white cursor-pointer active:scale-95 transition-all outline-none aspect-square shrink-0"
                    >
                      <Search className="size-4" />
                    </button>
                  </div>

                  {/* Dropdown Filter Container */}
                  <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Filter ratings</span>
                    <div className="relative flex items-center">
                      <select 
                        defaultValue="all"
                        className="appearance-none bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:border-[#892CDC]/50 text-xs text-slate-300 font-medium cursor-pointer w-full"
                      >
                        <option value="all">All ratings</option>
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                      </select>
                      <ChevronDown className="size-3 text-slate-400 absolute right-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 🌟 Section 3: Student Reviews Feed (Main Content Area) */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white mb-6">
                    Reviews
                  </h3>

                  <div className="space-y-6">
                    {studentReviewsList.map((rev) => (
                      <div key={rev.id} className="flex gap-4 items-start border-b border-slate-800 pb-8 last:border-b-0">
                        {/* Sisi Kiri (User Initial Avatar) */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#52057B]/60 to-[#892CDC]/80 text-white font-poppins font-bold text-xs flex items-center justify-center shrink-0 border border-[#892CDC]/30 shadow-inner select-none">
                          {rev.avatar}
                        </div>

                        {/* Sisi Ranan (Review Detail Content - Flex-1) */}
                        <div className="flex-1 min-w-0">
                          {/* Header Row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-white">{rev.user}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star 
                                  key={idx} 
                                  className={`size-3.5 ${
                                    idx < rev.rating 
                                      ? "fill-[#FAEB92] stroke-[#FAEB92]" 
                                      : "text-slate-700 fill-transparent"
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 font-mono font-light ml-auto">{rev.time}</span>
                          </div>

                          {/* Message Paragraph */}
                          <p className="text-sm text-slate-300 my-3 leading-relaxed">
                            {rev.body}
                          </p>

                          {/* Helpful Interaction Buttons */}
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                            <span className="text-slate-500">Was this review helpful?</span>
                            
                            {/* ThumbsUp Button */}
                            <button
                              onClick={() => handleVoteReview(rev.id, "up")}
                              className={`p-1.5 rounded-full border border-slate-800 hover:border-[#892CDC] hover:bg-[#892CDC]/10 transition cursor-pointer bg-transparent outline-none flex items-center justify-center ${
                                rev.helpfulState === "up" ? "bg-[#892CDC]/25 border-[#892CDC] text-[#DDA5FF]" : "text-slate-500"
                              }`}
                              title="Yes"
                            >
                              <ThumbsUp className="size-3.5" />
                            </button>

                            {/* ThumbsDown Button */}
                            <button
                              onClick={() => handleVoteReview(rev.id, "down")}
                              className={`p-1.5 rounded-full border border-slate-800 hover:border-red-400 hover:bg-red-500/10 transition cursor-pointer bg-transparent outline-none flex items-center justify-center ${
                                rev.helpfulState === "down" ? "bg-red-500/25 border-red-500 text-red-400" : "text-slate-500"
                              }`}
                              title="No"
                            >
                              <ThumbsDown className="size-3.5" />
                            </button>

                            {/* Report Text Link */}
                            <button 
                              onClick={() => showToast("Ulasan dilaporkan", "info")}
                              className="text-xs font-bold text-slate-400 hover:text-purple-400 transition cursor-pointer bg-transparent border-none p-0 outline-none ml-2"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 Section 4: Pagination Trigger (Bottom Area) */}
                <div className="pt-2">
                  <button
                    onClick={() => showToast("Memuat lebih banyak ulasan...", "info")}
                    className="w-full py-2.5 rounded-xl border border-purple-500/30 text-center text-sm font-bold text-white hover:bg-purple-600/10 transition cursor-pointer bg-transparent outline-none active:scale-95"
                  >
                    See more reviews
                  </button>
                </div>

              </div>
            )}

            {/* LEARNING TOOLS TAB CONTENT */}
            {activeTab === "tools" && (
              <div className="space-y-6 max-w-4xl text-slate-300">
                <h3 className="text-base font-bold text-white font-poppins">
                  Learning Tools & Reminders
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Tool 1: Study scheduler */}
                  <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-[#DDA5FF]" />
                      <h4 className="font-bold text-sm text-white font-poppins">Set Calendar Reminders</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                      Jadwalkan alarm kalender Google/Outlook Anda secara berkala agar tidak melupakan rutinitas belajar mingguan Anda.
                    </p>
                    <button
                      onClick={() => showToast("Membuka setelan reminder kalender (Simulasi)", "success")}
                      className="w-full py-2 border border-[#892CDC] hover:bg-[#892CDC]/10 text-xs font-bold text-white transition-all rounded-xl cursor-pointer bg-transparent outline-none active:scale-95"
                    >
                      Schedule Study Time
                    </button>
                  </div>

                  {/* Tool 2: Goal setting */}
                  <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center gap-3">
                      <Compass className="size-5 text-[#FAEB92]" />
                      <h4 className="font-bold text-sm text-white font-poppins">Weekly Study Goals</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                      Target belajar Anda saat ini diatur pada rentang waktu <strong>30 menit per hari</strong>. Dapatkan lencana prestasi setiap kali berhasil!
                    </p>
                    <button
                      onClick={() => showToast("Membuka setelan target target (Simulasi)", "info")}
                      className="w-full py-2 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all rounded-xl cursor-pointer bg-transparent outline-none active:scale-95"
                    >
                      Configure Daily Target
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Scrollable Left Column Footer */}
            <div className="pt-10 mt-12 border-t border-slate-900 shrink-0">
              <Footer />
            </div>

          </div>

        </div>

        {/* KOLOM KANAN: Course Content & Playlist Sidebar (Lebar: ~30% Desktop) */}
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
              onClick={() => router.push("/dashboard/my-learning")}
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
                    onClick={() => toggleSection(section.id)}
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
                            onClick={() => handleVideoSelect(vid.id)}
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
                                handleCompleteLesson(vid.id);
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
                              <span className={`block text-sm leading-snug font-medium transition-colors ${
                                isVideoActive ? "text-[#DDA5FF] font-bold" : "text-slate-200 hover:text-white"
                              }`}>
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
                                        setOpenResourcesId(openResourcesId === vid.id ? null : vid.id);
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
                                      <ChevronDown className={`size-3 transition-transform duration-200 ${openResourcesId === vid.id ? "rotate-180" : ""}`} />
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
                                                setOpenResourcesId(null);
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

      </div>

      {/* TOAST NOTIFICATION CONTAINER */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

    </div>
  );
}
