"use client";

import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "MD, BrightLabs",
    quote: "Refined our brand & increased inbound leads by 70% in just a few months.",
    hasAvatar: false
  },
  {
    name: "Jordan Devereaux",
    role: "Lead Architect, Fanitech",
    quote: "The interactive coding workspace is a game-changer. I went from zero to launching my first SaaS in 60 days.",
    hasAvatar: true
  },
  {
    name: "Clara Oswald",
    role: "Software Engineer",
    quote: "ByteStart courses are clear, concise, and incredibly useful. The best investment I've made in my career.",
    hasAvatar: false
  }
];

export function TestimonialsSection() {
  return (
    <div className="bg-black w-full py-16 px-6 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2] text-white">
            Client Feedback
          </h2>
          <p className="text-[16px] text-white/70 leading-relaxed">
            Discover success stories from satisfied clients. Learn how we assisted them in reaching their objectives and generating significant, enduring results.
          </p>
        </div>

        {/* Testimonial slider grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white/[0.04] border border-white/10 rounded-[20px] p-8 w-full max-w-[400px] h-[340px] flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative group animate-in fade-in"
            >
              {/* Visual backdrop cover for the middle card with avatar */}
              {t.hasAvatar && (
                <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none z-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  <img
                    alt=""
                    className="absolute w-full h-full object-cover"
                    src="/images/landing/Frame 72.png"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#753795]/20 to-black/90" />
                </div>
              )}

              {/* Rating stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[16px] text-white/90 leading-relaxed italic flex-grow pt-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author Metadata */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-[#A156E3]">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">{t.name}</h4>
                  <p className="text-white/60 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
