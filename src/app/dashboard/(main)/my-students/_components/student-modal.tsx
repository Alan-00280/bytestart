"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Student } from "@/data/studentsMock";
import { coursesData } from "@/data/coursesMock";

interface StudentModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  student: Student | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    course: string;
    progress: number;
    status: "Active" | "Completed" | "Inactive";
  }) => void;
}

export function StudentModal({
  isOpen,
  mode,
  student,
  onClose,
  onSave
}: StudentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"Active" | "Completed" | "Inactive">("Active");

  // Sync form states with target student when editing
  useEffect(() => {
    if (mode === "edit" && student) {
      setName(student.name);
      setEmail(student.email);
      setCourse(student.course);
      setProgress(student.progress);
      setStatus(student.status);
    } else {
      setName("");
      setEmail("");
      setCourse(coursesData[0]?.title || "");
      setProgress(0);
      setStatus("Active");
    }
  }, [mode, student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !course) return;

    onSave({
      name: name.trim(),
      email: email.trim(),
      course,
      progress,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col gap-6 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-bold text-white font-poppins">
            {mode === "add" ? "Add New Student" : "Edit Student Info"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent outline-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Victor Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all placeholder-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. victor.santoso@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all placeholder-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Enrolled Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl h-10 px-3 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all"
            >
              {coursesData.map((c) => (
                <option key={c.id} value={c.title} className="bg-slate-950 text-white">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Progress ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none mt-4"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl h-10 px-3 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all"
              >
                <option value="Active" className="bg-slate-950 text-white font-medium">Active</option>
                <option value="Completed" className="bg-slate-950 text-white font-medium">Completed</option>
                <option value="Inactive" className="bg-slate-950 text-white font-medium">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all text-xs font-bold cursor-pointer bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#892CDC] hover:bg-purple-700 active:scale-95 text-white transition-all text-xs font-bold cursor-pointer border-none shadow-md shadow-purple-600/10"
            >
              {mode === "add" ? "Create Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
