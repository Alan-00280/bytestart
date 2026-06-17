"use client";

import React from "react";
import { Trash2 } from "lucide-react";

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

interface CourseQaManagerProps {
  questions: Question[];
  newQuestionTitle: string;
  setNewQuestionTitle: (val: string) => void;
  newQuestionBody: string;
  setNewQuestionBody: (val: string) => void;
  newQuestionLecture: string;
  setNewQuestionLecture: (val: string) => void;
  onAddQuestion: (e: React.FormEvent) => void;
  onDeleteQuestion: (id: string) => void;
  qaRepliesText: Record<string, string>;
  onQaReplyChange: (qId: string, val: string) => void;
  onAddQaReply: (qId: string) => void;
}

export function CourseQaManager({
  questions,
  newQuestionTitle,
  setNewQuestionTitle,
  newQuestionBody,
  setNewQuestionBody,
  newQuestionLecture,
  setNewQuestionLecture,
  onAddQuestion,
  onDeleteQuestion,
  qaRepliesText,
  onQaReplyChange,
  onAddQaReply,
}: CourseQaManagerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Form: Create Simulation Question */}
      <div className="lg:col-span-1 border border-white/[0.06] bg-slate-900/10 rounded-2xl p-5 h-fit space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulate Student Query</h4>
        <form onSubmit={onAddQuestion} className="space-y-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Question Title</label>
            <input
              type="text"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Contoh: Hydration Error di SSR"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Lecture Reference</label>
            <input
              type="text"
              value={newQuestionLecture}
              onChange={(e) => setNewQuestionLecture(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-10 px-3.5 text-xs text-white outline-none transition-all"
              placeholder="Contoh: Lecture 24"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Question Body</label>
            <textarea
              rows={4}
              value={newQuestionBody}
              onChange={(e) => setNewQuestionBody(e.target.value)}
              className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl p-3 text-xs text-white outline-none transition-all resize-none"
              placeholder="Detail pertanyaan..."
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
          >
            Create Mock Question
          </button>
        </form>
      </div>

      {/* Right Panel: Discussions list and replies */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Q&A Forum Board ({questions.length})</h4>
        
        {questions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <span className="text-xs text-slate-500">No questions in this forum.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div 
                key={q.id} 
                className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-5 relative group flex flex-col gap-3"
              >
                {/* Delete Action */}
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-transparent border-none outline-none"
                  title="Delete Discussion Thread"
                >
                  <Trash2 className="size-4" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-800 text-[#DDA5FF] border border-slate-700 flex items-center justify-center text-xs font-bold select-none">
                    {q.avatar || q.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-white leading-none">{q.user}</h5>
                      <span className="text-[10px] text-amber-400 font-semibold leading-none bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded">
                        {q.lecture}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-none mt-1">Asked {q.time}</span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 leading-snug">{q.title}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{q.body}</p>
                </div>

                {/* Replies Feed */}
                {q.replies && q.replies.length > 0 && (
                  <div className="mt-2 border-t border-white/5 pt-3 space-y-3 pl-4 border-l-2 border-amber-500/20">
                    {q.replies.map((rep: any) => (
                      <div key={rep.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400">{rep.user}</span>
                          <span className="text-[9px] text-slate-500 font-mono">({rep.time})</span>
                        </div>
                        <p className="text-slate-400 font-light leading-relaxed">{rep.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Form */}
                <div className="mt-2 border-t border-white/5 pt-3 flex gap-2">
                  <input
                    type="text"
                    value={qaRepliesText[q.id] || ""}
                    onChange={(e) => onQaReplyChange(q.id, e.target.value)}
                    placeholder="Ketik jawaban tanggapan instruktur..."
                    className="flex-grow bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500/60 rounded-xl h-8 px-3 text-[11px] text-white outline-none transition-all placeholder-white/35"
                  />
                  <button
                    onClick={() => onAddQaReply(q.id)}
                    className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-xl transition-all cursor-pointer border-none outline-none shrink-0"
                  >
                    Tanggapi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
