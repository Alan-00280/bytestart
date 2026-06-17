"use client";

import React from "react";

export function TeachWithUsSection() {
  return (
    <div className="bg-black w-full py-16 border-t border-white/10 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-8">
        <h2 className="text-3xl sm:text-[61px] font-poppins font-semibold leading-tight text-white tracking-tight">
          Teach with us
        </h2>
        <a
          href="mailto:teach@bytestr.com"
          className="text-2xl sm:text-[40px] md:text-[61px] font-light text-white hover:text-[#A156E3] transition-colors leading-none tracking-tight break-all border-b border-white/20 hover:border-[#A156E3] pb-1"
        >
          teach@bytestr.com
        </a>
      </div>
    </div>
  );
}
