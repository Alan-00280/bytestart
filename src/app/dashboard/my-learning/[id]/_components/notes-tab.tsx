"use client";

import React from "react";
import { FileText, Clock, Trash2, Plus } from "lucide-react";

export interface NoteItem {
  id: string;
  timestamp: number; // in seconds
  timestampStr: string;
  content: string;
  date: string;
}

interface NotesTabProps {
  currentTime: number;
  notesList: NoteItem[];
  newNote: string;
  onNewNoteChange: (val: string) => void;
  onSaveNote: (e: React.FormEvent) => void;
  onNoteSeek: (timestamp: number) => void;
  onDeleteNote: (noteId: string) => void;
  formatTime: (sec: number) => string;
}

export function NotesTab({
  currentTime,
  notesList,
  newNote,
  onNewNoteChange,
  onSaveNote,
  onNoteSeek,
  onDeleteNote,
  formatTime,
}: NotesTabProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-poppins">Personal Learning Notes</h3>
        <div className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          Active Video Timestamp: <span className="text-[#FAEB92] font-bold">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* New Note Form */}
      <form
        onSubmit={onSaveNote}
        className="bg-slate-900/10 border border-slate-900 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-md"
      >
        <span className="block text-xs font-semibold text-slate-300">
          Catatan otomatis akan ter-link ke menit <strong className="text-[#FAEB92]">{formatTime(currentTime)}</strong>:
        </span>
        <textarea
          rows={2}
          placeholder="Tulis ringkasan penting atau reminder code di sini..."
          value={newNote}
          onChange={(e) => onNewNoteChange(e.target.value)}
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
                  onClick={() => onNoteSeek(note.timestamp)}
                  className="bg-[#892CDC]/15 border border-[#892CDC]/35 hover:bg-[#892CDC]/25 text-[#DDA5FF] text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer outline-none font-mono flex items-center gap-1.5 transition-colors"
                  title="Lompat ke video menit ini"
                >
                  <Clock className="size-3" />
                  <span>Menit {note.timestampStr}</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-light font-mono">{note.date}</span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
                    title="Hapus catatan"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
