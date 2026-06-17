"use client";

import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Clock, BookOpen, User, Star, Search } from "lucide-react";
import { Article } from "@/data/articlesMock";

interface ArticleListProps {
  articles: Article[];
  onCreateArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: number, title: string) => void;
}

export function ArticleList({
  articles,
  onCreateArticle,
  onEditArticle,
  onDeleteArticle,
}: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate metrics based on articles list
  const metrics = useMemo(() => {
    const total = articles.length;
    const featured = articles.filter((a) => a.featured).length;
    const totalReadMins = articles.reduce((acc, a) => {
      const match = a.readTime.match(/\d+/);
      return acc + (match ? parseInt(match[0], 10) : 0);
    }, 0);
    const avgReadTime = total > 0 ? Math.round(totalReadMins / total) : 0;
    return { total, featured, avgReadTime };
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [articles, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Total Articles</span>
            <span className="text-3xl font-black text-white font-poppins">{metrics.total}</span>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <BookOpen className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Featured Articles</span>
            <span className="text-3xl font-black text-[#DDA5FF] font-poppins">{metrics.featured}</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Star className="size-6 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400">Average Read Time</span>
            <span className="text-3xl font-black text-emerald-400 font-poppins">{metrics.avgReadTime} min</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Clock className="size-6" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Action and Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search articles by title, category, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl h-10 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/35 transition-all placeholder-white/30"
          />
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
        </div>
        <button
          onClick={onCreateArticle}
          className="flex items-center gap-1.5 bg-[#892CDC] hover:bg-[#A156E3] active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-purple-500/15 transition-all cursor-pointer border-none self-end sm:self-auto"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Create Article</span>
        </button>
      </div>

      {/* Grid Layout */}
      {filteredArticles.length === 0 ? (
        <div className="bg-slate-900/20 border border-white/[0.06] rounded-2xl py-12 px-6 text-center text-xs text-white/40">
          No articles found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.slice(0, 9).map((article) => (
            <div
              key={article.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/20 hover:border-purple-500/30 transition-all flex flex-col justify-between"
            >
              {/* Header Banner image */}
              <div className="w-full aspect-video relative overflow-hidden bg-slate-950">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                  {article.featured && (
                    <span className="text-[9px] font-extrabold uppercase bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  {article.popular && (
                    <span className="text-[9px] font-extrabold uppercase bg-purple-500/20 border border-purple-500/30 text-[#DDA5FF] px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4.5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-[#DDA5FF] uppercase tracking-widest leading-none">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug group-hover:text-purple-300 transition-colors truncate max-w-full">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1 font-semibold text-white">
                    <User className="size-3 text-purple-400" />
                    <span>{article.author}</span>
                  </div>

                  <div className="flex items-center gap-1 font-medium text-slate-400">
                    <Clock className="size-3 text-purple-400" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                  <span className="text-[10px] text-slate-500 font-medium">{article.date}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditArticle(article)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-[#892CDC] hover:text-white text-slate-300 transition-all border border-white/10 hover:border-purple-500 cursor-pointer outline-none"
                      title="Edit Article"
                    >
                      <Edit className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteArticle(article.id, article.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all border border-white/10 hover:border-red-500/30 cursor-pointer outline-none"
                      title="Delete Article"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mock Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.05] pt-6 mt-4 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">1-{Math.min(9, filteredArticles.length)}</span> of{" "}
          <span className="font-semibold text-white">{filteredArticles.length}</span> articles
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            disabled 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed text-[11px]"
          >
            Prev
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-[#892CDC] text-white font-bold border-none text-[11px]"
          >
            1
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            2
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            3
          </button>
          <button 
            type="button" 
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
