"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  Layers, 
  Calendar, 
  MessageSquare, 
  Star,
  CheckCircle,
  FileText
} from "lucide-react";
import { Course, coursesData } from "@/data/coursesMock";

// Import modular sub-components
import { CourseList } from "./_components/course-list";
import { CourseGeneralInfo } from "./_components/course-general-info";
import { CourseCurriculumManager } from "./_components/course-curriculum-manager";
import { CourseAnnouncementsManager } from "./_components/course-announcements-manager";
import { CourseQaManager } from "./_components/course-qa-manager";
import { CourseReviewsManager } from "./_components/course-reviews-manager";

// Interface definitions matching detail data
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  instructorName: string;
  commentsCount: number;
}

interface Question {
  id: string;
  user: string;
  avatar: string;
  title: string;
  body: string;
  lecture: string;
  time: string;
  votes: number;
  replies: any[];
}

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  time: string;
  body: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Workspace Active Tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"general" | "curriculum" | "announcements" | "qa" | "reviews">("general");
  
  // Details States
  const [syllabus, setSyllabus] = useState<SyllabusSection[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Form states for general info
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Frontend Development");
  const [formLevel, setFormLevel] = useState<"Pemula" | "Menengah" | "Mahir">("Menengah");
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState(0);
  const [formImage, setFormImage] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // New item modal/form states
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [newQuestionLecture, setNewQuestionLecture] = useState("");
  
  const [qaRepliesText, setQaRepliesText] = useState<Record<string, string>>({});

  // Alert/Feedback state
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Load courses on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("bytestart_owner_courses");
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (e) {
        setCourses(coursesData);
      }
    } else {
      setCourses(coursesData);
      localStorage.setItem("bytestart_owner_courses", JSON.stringify(coursesData));
    }
  }, []);

  const triggerAlert = (text: string, type: "success" | "error" | "info" = "success") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4500);
  };

  // Helper formatting
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  // Edit Course Trigger
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveWorkspaceTab("general");
    
    // Set general info states
    setFormTitle(course.title);
    setFormCategory(course.category);
    setFormLevel(course.level);
    setFormPrice(course.price);
    setFormOriginalPrice(course.originalPrice);
    setFormImage(course.image);
    setFormDuration(course.duration);
    setFormDescription(course.description);

    // Load Syllabus
    const savedSyllabus = localStorage.getItem(`bytestart_course_details_syllabus_${course.id}`);
    if (savedSyllabus) {
      try { setSyllabus(JSON.parse(savedSyllabus)); } catch (e) { setSyllabus(generateDefaultSyllabus(course.id)); }
    } else {
      const def = generateDefaultSyllabus(course.id);
      setSyllabus(def);
      localStorage.setItem(`bytestart_course_details_syllabus_${course.id}`, JSON.stringify(def));
    }

    // Load Announcements
    const savedAnnouncements = localStorage.getItem(`bytestart_course_details_announcements_${course.id}`);
    if (savedAnnouncements) {
      try { setAnnouncements(JSON.parse(savedAnnouncements)); } catch (e) { setAnnouncements(generateDefaultAnnouncements()); }
    } else {
      const def = generateDefaultAnnouncements();
      setAnnouncements(def);
      localStorage.setItem(`bytestart_course_details_announcements_${course.id}`, JSON.stringify(def));
    }

    // Load Q&A
    const savedQuestions = localStorage.getItem(`bytestart_course_details_questions_${course.id}`);
    if (savedQuestions) {
      try { setQuestions(JSON.parse(savedQuestions)); } catch (e) { setQuestions(generateDefaultQuestions()); }
    } else {
      const def = generateDefaultQuestions();
      setQuestions(def);
      localStorage.setItem(`bytestart_course_details_questions_${course.id}`, JSON.stringify(def));
    }

    // Load Reviews
    const savedReviews = localStorage.getItem(`bytestart_course_details_reviews_${course.id}`);
    if (savedReviews) {
      try { setReviews(JSON.parse(savedReviews)); } catch (e) { setReviews(generateDefaultReviews()); }
    } else {
      const def = generateDefaultReviews();
      setReviews(def);
      localStorage.setItem(`bytestart_course_details_reviews_${course.id}`, JSON.stringify(def));
    }
  };

  // Create New Course Action
  const handleCreateCourse = () => {
    const nextId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const newCourse: Course = {
      id: nextId,
      title: "New Course " + nextId,
      category: "Frontend Development",
      level: "Pemula",
      price: 499000,
      originalPrice: 799000,
      rating: 4.8,
      reviewsCount: 0,
      description: "Tuliskan deskripsi lengkap kelas pemrograman baru Anda di sini.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
      duration: "10 Jam",
      lessons: 2
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    localStorage.setItem("bytestart_owner_courses", JSON.stringify(updated));

    // Seed empty defaults
    const syllabusDef = [
      {
        id: `sec-${Date.now()}`,
        title: "Section 1: Getting Started Fundamentals",
        duration: "15min",
        videos: [
          { id: `vid-${Date.now()}-1`, title: "1. Welcome & Introduction", duration: "05:00", durationSeconds: 300 },
          { id: `vid-${Date.now()}-2`, title: "2. Setting up the environment", duration: "10:00", durationSeconds: 600 },
        ]
      }
    ];
    localStorage.setItem(`bytestart_course_details_syllabus_${newCourse.id}`, JSON.stringify(syllabusDef));
    localStorage.setItem(`bytestart_course_details_announcements_${newCourse.id}`, JSON.stringify([]));
    localStorage.setItem(`bytestart_course_details_questions_${newCourse.id}`, JSON.stringify([]));
    localStorage.setItem(`bytestart_course_details_reviews_${newCourse.id}`, JSON.stringify([]));

    handleEditCourse(newCourse);
    triggerAlert("Kelas baru berhasil diinisiasi! Silakan isi kurikulum dan detailnya.", "success");
  };

  // Delete Course Action
  const handleDeleteCourse = (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${title}" secara permanen?`)) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      localStorage.setItem("bytestart_owner_courses", JSON.stringify(updated));
      
      // Clean up detail keys
      localStorage.removeItem(`bytestart_course_details_syllabus_${id}`);
      localStorage.removeItem(`bytestart_course_details_announcements_${id}`);
      localStorage.removeItem(`bytestart_course_details_questions_${id}`);
      localStorage.removeItem(`bytestart_course_details_reviews_${id}`);
      
      triggerAlert(`Kelas "${title}" berhasil dihapus.`, "info");
    }
  };

  // Save changes action
  const handleSaveChanges = () => {
    if (!selectedCourse) return;

    // Recalculate lessons count from syllabus
    const totalLessons = syllabus.reduce((acc, sec) => acc + sec.videos.length, 0);

    const updatedCourse: Course = {
      ...selectedCourse,
      title: formTitle,
      category: formCategory,
      level: formLevel,
      price: formPrice,
      originalPrice: formOriginalPrice,
      image: formImage,
      duration: formDuration,
      description: formDescription,
      lessons: totalLessons
    };

    const updatedList = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    setCourses(updatedList);
    localStorage.setItem("bytestart_owner_courses", JSON.stringify(updatedList));

    // Save details
    localStorage.setItem(`bytestart_course_details_syllabus_${selectedCourse.id}`, JSON.stringify(syllabus));
    localStorage.setItem(`bytestart_course_details_announcements_${selectedCourse.id}`, JSON.stringify(announcements));
    localStorage.setItem(`bytestart_course_details_questions_${selectedCourse.id}`, JSON.stringify(questions));
    localStorage.setItem(`bytestart_course_details_reviews_${selectedCourse.id}`, JSON.stringify(reviews));

    setSelectedCourse(null);
    triggerAlert("Seluruh perubahan kursus berhasil disimpan!", "success");
  };

  // Curriculum Handlers
  const handleAddSection = () => {
    const newSec: SyllabusSection = {
      id: `sec-${Date.now()}`,
      title: "New Section Title",
      duration: "0min",
      videos: []
    };
    setSyllabus([...syllabus, newSec]);
  };

  const handleEditSectionTitle = (secId: string, title: string) => {
    setSyllabus(syllabus.map(s => s.id === secId ? { ...s, title } : s));
  };

  const handleDeleteSection = (secId: string) => {
    setSyllabus(syllabus.filter(s => s.id !== secId));
  };

  const handleAddVideo = (secId: string) => {
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: "New Lesson/Video " + (syllabus.find(s => s.id === secId)?.videos.length || 0 + 1),
      duration: "05:00",
      durationSeconds: 300,
      hasResources: false,
      resourceName: ""
    };
    
    setSyllabus(syllabus.map(s => {
      if (s.id === secId) {
        const nextVids = [...s.videos, newVid];
        const totalSecs = nextVids.reduce((sum, v) => sum + v.durationSeconds, 0);
        const mins = Math.ceil(totalSecs / 60);
        return {
          ...s,
          videos: nextVids,
          duration: `${mins}min`
        };
      }
      return s;
    }));
  };

  const handleEditVideoField = (secId: string, vidId: string, field: keyof VideoItem, value: any) => {
    setSyllabus(syllabus.map(s => {
      if (s.id === secId) {
        const nextVids = s.videos.map(v => {
          if (v.id === vidId) {
            if (field === "duration") {
              const parts = value.split(":");
              let secs = 300;
              if (parts.length === 2) {
                secs = (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
              }
              return { ...v, duration: value, durationSeconds: secs };
            }
            if (field === "hasResources") {
              return { ...v, hasResources: value, resourceName: value ? "source-code.zip" : "" };
            }
            return { ...v, [field]: value };
          }
          return v;
        });

        const totalSecs = nextVids.reduce((sum, v) => sum + v.durationSeconds, 0);
        const mins = Math.ceil(totalSecs / 60);

        return {
          ...s,
          videos: nextVids,
          duration: `${mins}min`
        };
      }
      return s;
    }));
  };

  const handleDeleteVideo = (secId: string, vidId: string) => {
    setSyllabus(syllabus.map(s => {
      if (s.id === secId) {
        const nextVids = s.videos.filter(v => v.id !== vidId);
        const totalSecs = nextVids.reduce((sum, v) => sum + v.durationSeconds, 0);
        const mins = Math.ceil(totalSecs / 60);
        return {
          ...s,
          videos: nextVids,
          duration: `${mins}min`
        };
      }
      return s;
    }));
  };

  // Announcements Handlers
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      instructorName: "ByteStart Team",
      commentsCount: 0
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    triggerAlert("Pengumuman baru diposting!", "success");
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    triggerAlert("Pengumuman dihapus.", "info");
  };

  // Q&A Handlers
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      user: "Pradipta Baskara",
      avatar: "PB",
      title: newQuestionTitle,
      body: newQuestionBody,
      lecture: newQuestionLecture || "General",
      time: "Just now",
      votes: 1,
      replies: []
    };
    setQuestions([newQ, ...questions]);
    setNewQuestionTitle("");
    setNewQuestionBody("");
    setNewQuestionLecture("");
    triggerAlert("Simulasi pertanyaan diskusi murid ditambahkan!", "success");
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    triggerAlert("Pertanyaan diskusi dihapus.", "info");
  };

  const handleAddQaReply = (qId: string) => {
    const replyText = qaRepliesText[qId];
    if (!replyText || !replyText.trim()) return;

    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          replies: [
            ...q.replies,
            {
              id: `rep-${Date.now()}`,
              user: "ByteStart Team (Instructor)",
              avatar: "BS",
              body: replyText,
              time: "Just now"
            }
          ]
        };
      }
      return q;
    }));

    setQaRepliesText({
      ...qaRepliesText,
      [qId]: ""
    });
    triggerAlert("Tanggapan berhasil dikirim!", "success");
  };

  // Review Handlers
  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    triggerAlert("Ulasan siswa dihapus.", "info");
  };

  // Calculate lessons total
  const totalLessons = useMemo(() => {
    return syllabus.reduce((sum, sec) => sum + sec.videos.length, 0);
  }, [syllabus]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert Banner */}
      {alertMessage && (
        <div className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-2 border px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-300 ${
          alertMessage.type === "success" 
            ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30" 
            : alertMessage.type === "info" 
            ? "bg-indigo-950/90 text-indigo-400 border-indigo-500/30" 
            : "bg-red-950/90 text-red-400 border-red-500/30"
        }`}>
          <CheckCircle className="size-5 shrink-0" />
          <span className="text-xs font-semibold">{alertMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      {!selectedCourse ? (
        <CourseList
          courses={courses}
          onCreateCourse={handleCreateCourse}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
          formatRupiah={formatRupiah}
        />
      ) : (
        <div className="flex flex-col gap-6 bg-slate-950/20 rounded-2xl border border-white/[0.06] p-6 backdrop-blur-xl">
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 transition-all cursor-pointer outline-none active:scale-95"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest leading-none">Course Studio Workspace</span>
                <h3 className="text-base font-black text-white truncate max-w-md sm:max-w-xl font-poppins mt-0.5">
                  {formTitle || "New Class Studio"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer border-none"
              >
                <Save className="size-3.5 stroke-[2.5]" />
                <span>Save Workspace</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Workspace Tabs */}
          <div className="flex overflow-x-auto gap-4 border-b border-white/[0.05] pb-1.5 no-scrollbar">
            {[
              { id: "general", label: "General Settings", icon: Settings },
              { id: "curriculum", label: "Curriculum / Syllabus", icon: Layers },
              { id: "announcements", label: "Announcements", icon: Calendar },
              { id: "qa", label: "Q&A Discussions", icon: MessageSquare },
              { id: "reviews", label: "Student Reviews", icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorkspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceTab(tab.id as any)}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "border-amber-500 text-amber-400 font-extrabold" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panels */}
          <div className="min-h-[400px]">
            {activeWorkspaceTab === "general" && (
              <CourseGeneralInfo
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formCategory={formCategory}
                setFormCategory={setFormCategory}
                formLevel={formLevel}
                setFormLevel={setFormLevel}
                formPrice={formPrice}
                setFormPrice={setFormPrice}
                formOriginalPrice={formOriginalPrice}
                setFormOriginalPrice={setFormOriginalPrice}
                formDuration={formDuration}
                setFormDuration={setFormDuration}
                formImage={formImage}
                setFormImage={setFormImage}
                formDescription={formDescription}
                setFormDescription={setFormDescription}
                totalLessons={totalLessons}
              />
            )}

            {activeWorkspaceTab === "curriculum" && (
              <CourseCurriculumManager
                syllabus={syllabus}
                onAddSection={handleAddSection}
                onEditSectionTitle={handleEditSectionTitle}
                onDeleteSection={handleDeleteSection}
                onAddVideo={handleAddVideo}
                onEditVideoField={handleEditVideoField}
                onDeleteVideo={handleDeleteVideo}
              />
            )}

            {activeWorkspaceTab === "announcements" && (
              <CourseAnnouncementsManager
                announcements={announcements}
                newAnnouncementTitle={newAnnouncementTitle}
                setNewAnnouncementTitle={setNewAnnouncementTitle}
                newAnnouncementContent={newAnnouncementContent}
                setNewAnnouncementContent={setNewAnnouncementContent}
                onAddAnnouncement={handleAddAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {activeWorkspaceTab === "qa" && (
              <CourseQaManager
                questions={questions}
                newQuestionTitle={newQuestionTitle}
                setNewQuestionTitle={setNewQuestionTitle}
                newQuestionBody={newQuestionBody}
                setNewQuestionBody={setNewQuestionBody}
                newQuestionLecture={newQuestionLecture}
                setNewQuestionLecture={setNewQuestionLecture}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                qaRepliesText={qaRepliesText}
                onQaReplyChange={(qId, val) => setQaRepliesText({ ...qaRepliesText, [qId]: val })}
                onAddQaReply={handleAddQaReply}
              />
            )}

            {activeWorkspaceTab === "reviews" && (
              <CourseReviewsManager
                reviews={reviews}
                onDeleteReview={handleDeleteReview}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Generate Default mock Syllabus data
function generateDefaultSyllabus(courseId: number): SyllabusSection[] {
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
        ],
      }
    ];
  }

  // Fallback default
  return [
    {
      id: "sec-1",
      title: "Section 1: Getting Started Fundamentals",
      duration: "15min",
      videos: [
        { id: `vid-${courseId}-1`, title: "1. Course Overview & Welcome", duration: "05:00", durationSeconds: 300 },
        { id: `vid-${courseId}-2`, title: "2. Project Environment Settings", duration: "10:00", durationSeconds: 600 },
      ]
    }
  ];
}

// Generate Default mock Announcements data
function generateDefaultAnnouncements(): Announcement[] {
  return [
    {
      id: "ann-1",
      title: "Selamat Datang di Kelas!",
      content: "Hi all! Selamat belajar di kelas ByteStart. Silakan unduh file zip starter template yang dilampirkan pada materi Section 1 untuk memulai pengerjaan proyek bersama.",
      date: "Jun 2026",
      instructorName: "ByteStart Team",
      commentsCount: 2
    },
    {
      id: "ann-2",
      title: "Update Materi Penyelarasan Next.js 15.2",
      content: "Kami baru saja mengupdate materi video di Section 3 untuk menyelaraskan kompatibilitas Server Actions dengan update rilis minor Next.js 15.2 terbaru. Selamat menonton!",
      date: "May 2026",
      instructorName: "ByteStart Team",
      commentsCount: 0
    }
  ];
}

// Generate Default mock Questions (Q&A) data
function generateDefaultQuestions(): Question[] {
  return [
    {
      id: "q-1",
      user: "Pradipta Baskara",
      avatar: "PB",
      title: "Hydration Mismatch on Server Components",
      body: "Muncul error hydration mismatch saat merender komponen tanggal statis. Bagaimana penanganan terbaik agar tidak merusak performa SSR?",
      lecture: "Lecture 24",
      time: "2 days ago",
      votes: 16,
      replies: [
        {
          id: "rep-1",
          user: "ByteStart Team (Instructor)",
          avatar: "BS",
          body: "Halo Pradipta! Masalah hydration mismatch biasanya terjadi jika ada elemen tanggal dinamis yang diproses secara lokal berbeda dengan server. Solusi paling aman adalah menyematkan status useEffect client-mounted atau menggunakan library suppressHydrationWarning.",
          time: "1 day ago"
        }
      ]
    },
    {
      id: "q-2",
      user: "Nabila Mutia",
      avatar: "NM",
      title: "Zod validation schema for nested forms",
      body: "Saya mencoba memvalidasi data form beralamat nested dengan Zod, tapi validasinya selalu mentok di level terluar. Adakah contoh schema-nya?",
      lecture: "Lecture 45",
      time: "1 week ago",
      votes: 8,
      replies: []
    }
  ];
}

// Generate Default mock Reviews data
function generateDefaultReviews(): Review[] {
  return [
    {
      id: "rev-1",
      user: "Victor Santoso",
      avatar: "VS",
      rating: 5,
      time: "5 months ago",
      body: "Kursus yang sangat komprehensif! Penjelasannya to the point dan sangat membantu pengerjaan proyek real-world di kantor saya."
    },
    {
      id: "rev-2",
      user: "Amelia Ekawati",
      avatar: "AE",
      rating: 4,
      time: "a month ago",
      body: "Sangat suka dengan materi Server Actions-nya. Kalau boleh ditambahkan modul deployment docker."
    }
  ];
}
