"use client";

import React from "react";
import { Check, UserCheck, Sparkles, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "info" | "role";
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: number) => void;
}

export function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[#190b24]/90 border border-white/15 backdrop-blur-md rounded-2xl p-4 flex items-start gap-3.5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto w-full select-none"
        >
          {/* Visual Icon indicator */}
          <div className={`p-1.5 rounded-lg shrink-0 ${
            toast.type === "success" 
              ? "bg-green-500/20 text-green-400" 
              : toast.type === "role"
                ? "bg-[#A156E3]/20 text-[#DDA5FF]"
                : "bg-blue-500/20 text-blue-400"
          }`}>
            {toast.type === "success" && <Check className="size-4" />}
            {toast.type === "role" && <UserCheck className="size-4" />}
            {toast.type === "info" && <Sparkles className="size-4" />}
          </div>

          {/* Toast Message text */}
          <div className="flex-grow pt-0.5">
            <p className="text-xs font-medium text-white/95 leading-relaxed">
              {toast.text}
            </p>
          </div>

          {/* Close button toast */}
          <button
            onClick={() => onClose(toast.id)}
            className="text-white/40 hover:text-white shrink-0 p-0.5 cursor-pointer bg-transparent border-none outline-none"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
