"use client";

import React from "react";
import { Calendar, Compass } from "lucide-react";

interface ToolsTabProps {
  showToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function ToolsTab({ showToast }: ToolsTabProps) {
  return (
    <div className="space-y-6 max-w-4xl text-slate-300">
      <h3 className="text-base font-bold text-white font-poppins">Learning Tools & Reminders</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tool 1: Study scheduler */}
        <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-[#DDA5FF]" />
            <h4 className="font-bold text-sm text-white font-poppins">Set Calendar Reminders</h4>
          </div>
          <p className="text-[11px] text-slate-400 font-light leading-relaxed">
            Jadwalkan alarm kalender Google/Outlook Anda secara berkala agar tidak melupakan rutinitas belajar mingguan
            Anda.
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
            Target belajar Anda saat ini diatur pada rentang waktu <strong>30 menit per hari</strong>. Dapatkan lencana
            prestasi setiap kali berhasil!
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
  );
}
