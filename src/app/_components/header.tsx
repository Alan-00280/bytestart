"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ButtonGlass } from "@/components/ui/button-glass";
import { ShoppingCart, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Header Wrapper (Matching Figma 71:231 & 71:232) */}
      <div className="sticky top-0 z-50 w-full max-w-[1290px] mx-auto px-4 md:px-0 py-6 h-auto flex items-start">
        <header className="backdrop-blur-xl bg-[rgba(62,5,113,0.18)] border border-white/[0.08] rounded-[58px] px-6 md:px-[50px] py-[10px] flex items-center justify-between w-full h-[79px] gap-[20px] shadow-[0px_8px_32px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3">
            <span className="font-poppins font-semibold text-2xl md:text-3xl text-white tracking-wide text-shadow-[0px_1px_4px_rgba(0,0,0,0.39)]">
              ByteStart
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-[35px] text-[16px] font-normal text-white/90 text-shadow-[0px_1px_4px_rgba(0,0,0,0.39)]">
            <a href="#about" className="hover:text-[#A156E3] transition-colors">About Us</a>
            <a href="#benefits" className="hover:text-[#A156E3] transition-colors">Benefit</a>
            <a href="/articles" className="hover:text-[#A156E3] transition-colors">Article</a>
            <Link href="/courses" scroll={false} className="hover:text-[#A156E3] transition-colors">Explore</Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-[20px]">
            <ButtonGlass themeType="outline" className="h-[43px] px-6" icon={<ShoppingCart className="size-5" />} logoRight>
              Cart
            </ButtonGlass>
            <ButtonGlass themeType="default" className="h-[43px] px-[45px]" asChild>
              <a href="https://true-series-379734.framer.app/">Sign Up</a>
            </ButtonGlass>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-[130px] left-6 right-6 bg-[#220234]/95 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-5 duration-300 lg:hidden">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">About Us</a>
          <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Benefit</a>
          <a href="/articles" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Article</a>
          <Link href="/courses" scroll={false} onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Explore</Link>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3]">FAQs</a>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <ButtonGlass themeType="outline" className="w-full h-11 justify-center" icon={<ShoppingCart className="size-5" />} logoRight>
              Cart
            </ButtonGlass>
            <ButtonGlass themeType="default" className="w-full h-11 justify-center" asChild>
              <a href="https://true-series-379734.framer.app/">Sign Up</a>
            </ButtonGlass>
          </div>
        </div>
      )}
    </>
  );
}
