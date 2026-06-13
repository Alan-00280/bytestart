"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCheck, ChevronDown, Check, ShoppingCart, Sparkles, Menu, X, Globe } from "lucide-react";
import { roles } from "@/data/coursesMock";

interface NavbarProps {
  currentRole: string;
  onRoleChange: (roleId: string, roleName: string) => void;
  onShowToast: (text: string, type?: "success" | "info" | "role") => void;
}

export function Navbar({ currentRole, onRoleChange, onShowToast }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const pathname = usePathname();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkCartCount = () => {
      const saved = localStorage.getItem("bytestart_cart");
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
            setCartCount(ids.length);
          }
        } catch (e) {
          // ignore
        }
      } else {
        setCartCount(3); // Default count matching initial items [1, 2, 3]
      }
    };

    checkCartCount();

    // Set up listeners to update count dynamically when cart is modified
    window.addEventListener("storage", checkCartCount);
    window.addEventListener("focus", checkCartCount);
    
    // Custom event listener for updates within the same window
    window.addEventListener("bytestart_cart_updated", checkCartCount);

    return () => {
      window.removeEventListener("storage", checkCartCount);
      window.removeEventListener("focus", checkCartCount);
      window.removeEventListener("bytestart_cart_updated", checkCartCount);
    };
  }, []);

  const handleRoleSelect = (roleId: string, roleName: string) => {
    onRoleChange(roleId, roleName);
    setRoleDropdownOpen(false);
  };

  const isHomeActive = pathname === "/";
  const isCatalogActive = pathname.startsWith("/courses");
  const isArticlesActive = pathname.startsWith("/articles");

  const activeRoleName = roles.find((r) => r.id === currentRole)?.name || "Calon Pelanggan";
  const activeRoleBadge = roles.find((r) => r.id === currentRole)?.badgeColor || "bg-gray-500/20 text-gray-300";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md h-[76px] transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="font-poppins font-semibold text-2xl text-white tracking-wide hover:opacity-85 transition-opacity">
              StartByte
            </Link>
          </div>

          {/* Nav Links (Standard Route) */}
          <nav className="hidden md:flex items-center gap-[35px] text-[15px] font-normal text-white/85">
            <Link href="/" className={`transition-colors ${isHomeActive ? "text-[#A156E3] font-medium" : "hover:text-[#A156E3] text-white/80"}`}>Home</Link>
            <Link href="/courses" className={`transition-colors ${isCatalogActive ? "text-[#A156E3] font-medium" : "hover:text-[#A156E3] text-white/80"}`}>Courses</Link>
            <Link href="/articles" className={`transition-colors ${isArticlesActive ? "text-[#A156E3] font-medium" : "hover:text-[#A156E3] text-white/80"}`}>Articles</Link>
          </nav>

          {/* Action Buttons & Role Switcher */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Simulasi Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="bg-white/5 border border-white/10 text-white rounded-full px-4 py-2 hover:bg-white/10 text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer select-none active:scale-[0.98]"
              >
                <UserCheck className="size-4 text-[#A156E3]" />
                <span>Role: {activeRoleName}</span>
                <ChevronDown className={`size-3 text-white/50 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-[#1a0c24] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] uppercase font-bold text-white/40 px-3 py-1.5 tracking-wider border-b border-white/5 mb-1">
                    Simulasikan Peran
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id, r.name)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                        currentRole === r.id
                          ? "bg-[#A156E3]/20 text-white font-medium"
                          : "hover:bg-white/5 text-white/80"
                      }`}
                    >
                      <span>{r.name}</span>
                      {currentRole === r.id && <Check className="size-3 text-[#A156E3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="bg-transparent border border-white/20 hover:border-white rounded-full p-2.5 transition-all text-white/80 hover:text-white flex items-center justify-center cursor-pointer relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="size-[18px]" />
              <span className="absolute -top-1 -right-1 bg-[#A156E3] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black animate-pulse">
                {cartCount}
              </span>
            </Link>

            {/* Contextual Action Button or Profile Dropdown */}
            {currentRole === "student" ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="size-9 rounded-full bg-gradient-to-br from-[#A156E3] to-[#892CDC] text-white font-poppins font-bold text-xs flex items-center justify-center border border-white/20 relative cursor-pointer hover:shadow-[0_0_12px_rgba(161,86,227,0.3)] transition-all select-none active:scale-95 outline-none"
                  aria-label="Account Menu"
                >
                  <span>LA</span>
                  {/* Status Indicator Dot */}
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#FAEB92] border-2 border-slate-950 animate-pulse" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Blok 1: User Profile Header */}
                    <div className="p-4 flex items-center gap-3 bg-white/[0.02]">
                      <div className="size-11 rounded-full bg-gradient-to-br from-[#52057B] to-[#892CDC] text-white font-poppins font-bold text-sm flex items-center justify-center border border-white/10 shrink-0">
                        LA
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-tight truncate">Luthfi Alan</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">alanperdana08@gmail.com</p>
                      </div>
                    </div>

                    {/* Blok 2: Core Learning & Cart Links */}
                    <div className="py-1.5 flex flex-col">
                      <Link
                        href="/dashboard/my-learning"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>My learning</span>
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>My cart</span>
                        <span className="bg-[#892CDC] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      </Link>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileDropdownOpen(false);
                          onShowToast("Membuka Wishlist (Simulasi)", "info");
                        }}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Wishlist</span>
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleRoleSelect("owner", "Course Owner");
                        }}
                        className="w-full text-left py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer bg-transparent border-none outline-none"
                      >
                        <span>Teach on ByteStart</span>
                      </button>
                    </div>

                    {/* Blok 3: Communications & Alerts */}
                    <div className="py-1.5 flex flex-col">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileDropdownOpen(false);
                          onShowToast("Membuka Notifikasi (Simulasi)", "info");
                        }}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Notifications</span>
                      </Link>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileDropdownOpen(false);
                          onShowToast("Membuka Pesan Masuk (Simulasi)", "info");
                        }}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Messages</span>
                      </Link>
                    </div>

                    {/* Blok 4: Account Settings & Purchase History */}
                    <div className="py-1.5 flex flex-col">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileDropdownOpen(false);
                          onShowToast("Membuka Pengaturan Akun (Simulasi)", "info");
                        }}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Account settings</span>
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Payment methods</span>
                      </Link>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileDropdownOpen(false);
                          onShowToast("Membuka Subskripsi (Simulasi)", "info");
                        }}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Subscriptions</span>
                      </Link>
                      <Link
                        href="/dashboard/purchase-history"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="py-2 px-4 text-xs font-semibold text-slate-300 hover:text-[#DDA5FF] hover:bg-white/[0.03] transition-colors flex items-center cursor-pointer"
                      >
                        <span>Purchase history</span>
                      </Link>
                    </div>

                    {/* Blok 5: Language Selection */}
                    <div className="p-3 flex justify-between items-center text-xs font-semibold text-slate-300 bg-white/[0.01]">
                      <span>Language</span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="size-3.5" />
                        <span>English</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ) : currentRole === "public" ? (
              <div className="flex items-center gap-3">
                <Link
                  href="https://true-series-379734.framer.app/login"
                  className="text-white/80 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="https://true-series-379734.framer.app/"
                  className="bg-[#A156E3] hover:bg-[#8e45cf] text-white text-xs font-semibold px-5 py-2 rounded-full transition-all cursor-pointer shadow-lg shadow-[#A156E3]/20 hover:shadow-[#A156E3]/35 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  let path = "/dashboard/my-learning";
                  if (currentRole === "admin") path = "/dashboard/admin";
                  if (currentRole === "owner") path = "/dashboard/owner";
                  onShowToast(`Mengalihkan ke ${activeRoleName} Dashboard di rute ${path} (Simulasi)`, "info");
                }}
                className="bg-[#A156E3] hover:bg-[#8e45cf] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#A156E3]/20"
              >
                <Sparkles className="size-3.5" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-3">
            {/* Simple Compact Role Badge */}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${activeRoleBadge}`}>
              {activeRoleName}
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-[77px] left-4 right-4 bg-[#14061c]/95 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 z-40 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 md:hidden">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`text-lg py-2 border-b border-white/5 transition-colors ${isHomeActive ? "text-[#A156E3] font-semibold" : "hover:text-[#A156E3]"}`}>Home</Link>
          <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className={`text-lg py-2 border-b border-white/5 transition-colors ${isCatalogActive ? "text-[#A156E3] font-semibold" : "hover:text-[#A156E3]"}`}>Courses</Link>
          <Link href="/articles" onClick={() => setMobileMenuOpen(false)} className={`text-lg py-2 border-b border-white/5 transition-colors ${isArticlesActive ? "text-[#A156E3] font-semibold" : "hover:text-[#A156E3]"}`}>Articles</Link>
          
          {/* Mobile Role Switcher List */}
          <div className="py-2 border-b border-white/5">
            <span className="block text-xs uppercase font-bold text-white/40 mb-2.5 tracking-wider">Simulasi Role</span>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id, r.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-[11px] font-semibold p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    currentRole === r.id
                      ? "bg-[#A156E3] text-white border-[#A156E3]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 justify-center rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 text-white hover:text-white"
            >
              <ShoppingCart className="size-4 text-white" />
              <span className="text-sm">Keranjang</span>
            </Link>
            
            {currentRole !== "public" ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  let path = "/dashboard/my-learning";
                  if (currentRole === "admin") path = "/dashboard/admin";
                  if (currentRole === "owner") path = "/dashboard/owner";
                  onShowToast(`Mengalihkan ke ${activeRoleName} Dashboard di rute ${path} (Simulasi)`, "info");
                }}
                className="w-full h-11 justify-center rounded-xl bg-[#A156E3] text-white flex items-center gap-2 cursor-pointer font-semibold text-sm"
              >
                <Sparkles className="size-4" />
                <span>Dashboard</span>
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="https://true-series-379734.framer.app/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 h-11 justify-center rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-white text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="https://true-series-379734.framer.app/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 h-11 justify-center rounded-xl bg-[#A156E3] text-white flex items-center justify-center cursor-pointer font-semibold text-sm shadow-lg shadow-[#A156E3]/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
