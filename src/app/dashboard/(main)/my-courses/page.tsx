"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Course, coursesData } from "@/data/coursesMock";
import { CourseList } from "./_components/course-list";

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Load courses on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("bytestart_owner_courses");
    const ownerCourses = coursesData.filter(c => c.ownerId === "owner-1");
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses);
        if (Array.isArray(parsed)) {
          // Normalize old courses by adding ownerId from coursesMock if missing
          const normalized = parsed.map((c: any) => {
            if (!c.ownerId) {
              const original = coursesData.find(o => o.id === c.id);
              return { ...c, ownerId: original ? original.ownerId : "owner-1" };
            }
            return c;
          });
          
          // Save normalized courses back to localStorage to heal the store
          localStorage.setItem("bytestart_owner_courses", JSON.stringify(normalized));
          
          const filtered = normalized.filter((c: any) => c.ownerId === "owner-1");
          setCourses(filtered);
        } else {
          setCourses(ownerCourses);
        }
      } catch (e) {
        setCourses(ownerCourses);
      }
    } else {
      setCourses(ownerCourses);
      localStorage.setItem("bytestart_owner_courses", JSON.stringify(ownerCourses));
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

  // Edit Course: redirect to slug editor
  const handleEditCourse = (course: Course) => {
    router.push(`/dashboard/my-courses/${course.id}`);
  };

  // Create New Course: create in local storage and redirect to editor
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
      lessons: 2,
      ownerId: "owner-1"
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

    router.push(`/dashboard/my-courses/${newCourse.id}`);
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

      <CourseList
        courses={courses}
        onCreateCourse={handleCreateCourse}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
        formatRupiah={formatRupiah}
      />
    </div>
  );
}
