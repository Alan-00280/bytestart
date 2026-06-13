"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-poppins font-semibold text-base text-white tracking-wide">
            StartByte
          </span>
          <span className="text-[10px] text-white/35">
            © {new Date().getFullYear()} Alan Perdana. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
          <Link href="/" className="hover:text-[#A156E3] transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-[#A156E3] transition-colors">Catalog</Link>
          <Link href="/articles" className="hover:text-[#A156E3] transition-colors">Articles</Link>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>

      </div>
    </footer>
  );
}
