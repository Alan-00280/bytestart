"use client";

import React, { useState } from "react";
import { Check, Mail, Phone, MapPin } from "lucide-react";

export function FooterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-black w-full pt-20 pb-12 px-6 lg:px-24 relative overflow-hidden border-t border-white/10">
      {/* Glow backdrop behind Footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[800px] pointer-events-none opacity-40 z-0">
        <img alt="" className="w-full h-full object-cover" src="/images/landing/Group 4.svg" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">

        {/* Main flex columns (Newsletter card + navigation links) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start justify-between">

          {/* Newsletter Subscription Box */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 w-full lg:max-w-[420px] h-[280px] flex flex-col justify-between">
            <h3 className="font-poppins font-medium text-2xl sm:text-3xl text-white">
              Subscribe to our newsletter
            </h3>

            <form onSubmit={handleSubscribe} className="relative border-b border-white/40 pb-2 flex items-center justify-between">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-transparent border-none text-white text-base placeholder-white/40 outline-none w-full pr-10 py-1"
              />
              <button type="submit" className="absolute right-0 text-white hover:text-[#A156E3] transition-colors cursor-pointer" aria-label="Subscribe">
                {subscribed ? <Check className="w-6 h-6 text-green-400" /> : <Mail className="w-6 h-6" />}
              </button>
            </form>

            {subscribed && (
              <p className="text-green-400 text-xs font-semibold animate-pulse">
                Subscribed successfully! Thank you.
              </p>
            )}
          </div>

          {/* Link Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[15px] text-white/80 w-full lg:flex-grow">

            {/* Column 1 */}
            <div className="space-y-4">
              <h4 className="font-poppins font-semibold text-white tracking-wide">Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="hover:text-[#A156E3] transition-colors">Home</a>
                <a href="#about" className="hover:text-[#A156E3] transition-colors">About Us</a>
                <a href="#benefits" className="hover:text-[#A156E3] transition-colors">Benefits</a>
                <a href="#courses" className="hover:text-[#A156E3] transition-colors">Explore</a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="font-poppins font-semibold text-white tracking-wide">Support</h4>
              <div className="flex flex-col gap-2.5">
                <a href="#faq" className="hover:text-[#A156E3] transition-colors">FAQs</a>
                <a href="#" className="hover:text-[#A156E3] transition-colors">Support Center</a>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="font-poppins font-semibold text-white tracking-wide">Get in Touch With Us</h4>
              <div className="flex flex-col gap-3 font-light text-white/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#A156E3]" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#A156E3]" />
                  <span>hello@bytestart.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A156E3]" />
                  <span>123 Main Street, Cyber City</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Large Brand Text & Copyright block */}
        <div className="pt-12 border-t border-white/10 flex flex-col gap-8 items-start justify-end w-full">
          <div className="flex items-end gap-4 w-full">
            <span className="font-poppins font-bold text-5xl sm:text-7xl lg:text-[120px] leading-[0.75] text-white tracking-[-2px] uppercase select-none">
              BYTESTART
            </span>
            <span className="text-white text-base md:text-2xl font-semibold mb-1">
              TM
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full text-[14px] text-white/50 gap-4">
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <p>&copy; {new Date().getFullYear()} Alan Perdana. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
