"use client";

import React, { useState, useEffect } from "react";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Student, initialStudents } from "@/data/studentsMock";
import { StudentList } from "./_components/student-list";
import { StudentModal } from "./_components/student-modal";

export default function MyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Load students from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bytestart_owner_students");
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        setStudents(initialStudents);
      }
    } else {
      setStudents(initialStudents);
      localStorage.setItem("bytestart_owner_students", JSON.stringify(initialStudents));
    }
  }, []);

  const saveStudents = (newList: Student[]) => {
    setStudents(newList);
    localStorage.setItem("bytestart_owner_students", JSON.stringify(newList));
  };

  // Toast Helper
  const showToast = (text: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleCloseToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD actions
  const handleAddStudent = () => {
    setModalMode("add");
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setModalMode("edit");
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus siswa "${name}" dari sistem?`)) {
      const newList = students.filter((s) => s.id !== id);
      saveStudents(newList);
      showToast(`Siswa "${name}" berhasil dihapus!`, "success");
    }
  };

  const handleSendEmail = (name: string, email: string) => {
    showToast(`Simulasi mengirim email ke ${name}`, "info");
  };

  const handleSaveStudent = (data: {
    name: string;
    email: string;
    course: string;
    progress: number;
    status: "Active" | "Completed" | "Inactive";
  }) => {
    if (modalMode === "add") {
      const getInitials = (nameStr: string) => {
        const parts = nameStr.trim().split(/\s+/);
        if (parts.length >= 2) {
          return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0] ? parts[0].substring(0, 2).toUpperCase() : "ST";
      };

      const newStudent: Student = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        avatar: getInitials(data.name),
        course: data.course,
        progress: data.progress,
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        status: data.status
      };

      const newList = [newStudent, ...students];
      saveStudents(newList);
      showToast(`Siswa "${data.name}" berhasil ditambahkan!`, "success");
    } else {
      if (editingStudent) {
        const newList = students.map((s) => {
          if (s.id === editingStudent.id) {
            return {
              ...s,
              name: data.name,
              email: data.email,
              course: data.course,
              progress: data.progress,
              status: data.status
            };
          }
          return s;
        });
        saveStudents(newList);
        showToast(`Detail siswa "${data.name}" berhasil diperbarui!`, "success");
      }
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Toast toasts={toasts} onClose={handleCloseToast} />

      <StudentList
        students={students}
        onAddStudent={handleAddStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        onSendEmail={handleSendEmail}
      />

      <StudentModal
        isOpen={isModalOpen}
        mode={modalMode}
        student={editingStudent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
      />
    </>
  );
}
