"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  CheckCircle,
  Clock,
  UserPlus,
  Trash2,
  Edit
} from "lucide-react";
import { Student } from "@/data/studentsMock";

interface StudentListProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: number, name: string) => void;
  onSendEmail: (name: string, email: string) => void;
}

export function StudentList({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onSendEmail
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "All" || student.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchQuery, statusFilter]);

  // Paginated Students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  }, [filteredStudents, pageSize]);

  // Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const completed = students.filter((s) => s.status === "Completed").length;
    return { total, active, completed };
  }, [students]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white">Students Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor student enrollments, course learning progress, and active participation.
          </p>
        </div>
        <button
          onClick={onAddStudent}
          className="flex items-center justify-center gap-1.5 bg-[#892CDC] hover:bg-purple-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/15 transition-all cursor-pointer border-none shrink-0"
        >
          <UserPlus className="size-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Total Students</span>
            <span className="text-3xl font-black text-white font-poppins">{metrics.total}</span>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-[#DDA5FF]">
            <Users className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Active Students</span>
            <span className="text-3xl font-black text-indigo-400 font-poppins">{metrics.active}</span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[#A156E3]">
            <Clock className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Completed Courses</span>
            <span className="text-3xl font-black text-emerald-400 font-poppins">{metrics.completed}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <CheckCircle className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Filtering and Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-xl border border-white/[0.06] self-start">
          {(["All", "Active", "Completed", "Inactive"] as const).map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all border-none cursor-pointer ${
                  isActive
                    ? "bg-[#892CDC] text-white shadow-md shadow-purple-600/10"
                    : "bg-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-md relative w-full">
          <input
            type="text"
            placeholder="Search students by name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl h-10 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all placeholder-white/30"
          />
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
        </div>
      </div>

      {/* Table List Container */}
      <div className="rounded-2xl border border-white/[0.06] bg-slate-900/20 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-slate-950/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Enrolled Course</th>
                <th className="py-4 px-6">Progress</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-white/40">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                    {/* Student Avatar + Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white border border-white/10 select-none shrink-0">
                          {student.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white truncate max-w-[160px]">{student.name}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[160px]">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 max-w-[280px]">
                      <span className="font-medium text-slate-200 line-clamp-1" title={student.course}>
                        {student.course}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-6 min-w-[130px]">
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#892CDC] rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-300 whitespace-nowrap">
                      {student.joinedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                        student.status === "Completed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : student.status === "Active"
                          ? "bg-purple-500/10 border-purple-500/20 text-[#DDA5FF]"
                          : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSendEmail(student.name, student.email)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#892CDC] hover:text-white text-slate-300 transition-all border border-white/10 hover:border-[#892CDC] cursor-pointer outline-none"
                          title="Email Student"
                        >
                          <Mail className="size-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/10 cursor-pointer outline-none"
                          title="Edit Student"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id, student.name)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all border border-white/10 hover:border-red-500/20 cursor-pointer outline-none"
                          title="Delete Student"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.05] pt-6 mt-2 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
          <span className="font-semibold text-white">
            {Math.min(currentPage * pageSize, filteredStudents.length)}
          </span>{" "}
          of <span className="font-semibold text-white">{filteredStudents.length}</span> students
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className={`px-3 py-1.5 rounded-lg border text-[11px] transition-all cursor-pointer ${
              currentPage === 1 
                ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed" 
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;
            return (
              <button 
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer border ${
                  isActive 
                    ? "bg-[#892CDC] text-white font-bold border-purple-500 shadow-md shadow-purple-600/10" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            type="button" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className={`px-3 py-1.5 rounded-lg border text-[11px] transition-all cursor-pointer ${
              currentPage === totalPages 
                ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed" 
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
