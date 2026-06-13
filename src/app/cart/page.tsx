"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Clock, 
  BookOpen, 
  ShoppingCart, 
  ArrowRight, 
  Tag, 
  Percent, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Bookmark, 
  Heart 
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { CourseCard } from "@/components/courses/CourseCard";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, Course } from "@/data/coursesMock";

export default function ShoppingCartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Cart state stored as array of course IDs
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState("");
  
  // Save for Later & Wishlist simulated states
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState("public");

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show toast utility
  const showToast = (text: string, type: "success" | "info" | "role" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Close toast helper
  const handleCloseToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize data on mount
  useEffect(() => {
    setMounted(true);

    // Get role from localStorage if available
    const savedRole = localStorage.getItem("bytestart_role");
    if (savedRole) {
      setCurrentRole(savedRole);
    }

    // Initialize cart from localStorage, or populate with defaults [1, 2, 3] if empty
    const savedCart = localStorage.getItem("bytestart_cart");
    if (savedCart) {
      setCartIds(JSON.parse(savedCart));
    } else {
      const defaultCart = [1, 2, 3];
      setCartIds(defaultCart);
      localStorage.setItem("bytestart_cart", JSON.stringify(defaultCart));
    }

    // Load Save for later
    const savedForLater = localStorage.getItem("bytestart_saved");
    if (savedForLater) {
      setSavedIds(JSON.parse(savedForLater));
    }

    // Load Wishlist
    const savedWishlist = localStorage.getItem("bytestart_wishlist");
    if (savedWishlist) {
      setWishlistIds(JSON.parse(savedWishlist));
    }
  }, []);

  // Update cart in localStorage whenever state changes
  const updateCart = (newIds: number[]) => {
    setCartIds(newIds);
    localStorage.setItem("bytestart_cart", JSON.stringify(newIds));
  };

  // Update saved for later
  const updateSaved = (newIds: number[]) => {
    setSavedIds(newIds);
    localStorage.setItem("bytestart_saved", JSON.stringify(newIds));
  };

  // Update wishlist
  const updateWishlist = (newIds: number[]) => {
    setWishlistIds(newIds);
    localStorage.setItem("bytestart_wishlist", JSON.stringify(newIds));
  };

  // Handle role change
  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    localStorage.setItem("bytestart_role", roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  // Format currency Helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Map IDs to course objects
  const cartItems = useMemo(() => {
    return cartIds
      .map(id => coursesData.find(c => c.id === id))
      .filter((c): c is Course => !!c);
  }, [cartIds]);

  // Calculations
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.price, 0);
  }, [cartItems]);

  const originalTotalPrice = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.originalPrice, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return originalTotalPrice - totalPrice;
  }, [originalTotalPrice, totalPrice]);

  const finalPrice = useMemo(() => {
    if (couponApplied) {
      // Apply 10% coupon discount
      return Math.round(totalPrice * 0.9);
    }
    return totalPrice;
  }, [totalPrice, couponApplied]);

  // Remove item from cart
  const handleRemoveItem = (id: number, title: string) => {
    const newCart = cartIds.filter(itemId => itemId !== id);
    updateCart(newCart);
    showToast(`&ldquo;${title}&rdquo; dihapus dari keranjang belanja`, "info");
  };

  // Save for later simulation
  const handleSaveForLater = (id: number, title: string) => {
    if (!savedIds.includes(id)) {
      const newSaved = [...savedIds, id];
      updateSaved(newSaved);
    }
    const newCart = cartIds.filter(itemId => itemId !== id);
    updateCart(newCart);
    showToast(`&ldquo;${title}&rdquo; disimpan untuk nanti`, "success");
  };

  // Move to wishlist simulation
  const handleMoveToWishlist = (id: number, title: string) => {
    if (!wishlistIds.includes(id)) {
      const newWish = [...wishlistIds, id];
      updateWishlist(newWish);
    }
    const newCart = cartIds.filter(itemId => itemId !== id);
    updateCart(newCart);
    showToast(`&ldquo;${title}&rdquo; dipindahkan ke Wishlist`, "success");
  };

  // Restore item to cart from Saved list
  const handleMoveToCart = (id: number, title: string, source: "saved" | "wishlist") => {
    if (!cartIds.includes(id)) {
      const newCart = [...cartIds, id];
      updateCart(newCart);
    }
    if (source === "saved") {
      const newSaved = savedIds.filter(itemId => itemId !== id);
      updateSaved(newSaved);
      showToast(`&ldquo;${title}&rdquo; ditambahkan kembali ke keranjang`, "success");
    } else {
      const newWish = wishlistIds.filter(itemId => itemId !== id);
      updateWishlist(newWish);
      showToast(`&ldquo;${title}&rdquo; ditambahkan dari Wishlist ke keranjang`, "success");
    }
  };

  // Remove item from saved
  const handleRemoveFromSaved = (id: number, title: string) => {
    const newSaved = savedIds.filter(itemId => itemId !== id);
    updateSaved(newSaved);
    showToast(`&ldquo;${title}&rdquo; dihapus dari daftar simpanan`, "info");
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = (id: number, title: string) => {
    const newWish = wishlistIds.filter(itemId => itemId !== id);
    updateWishlist(newWish);
    showToast(`&ldquo;${title}&rdquo; dihapus dari Wishlist`, "info");
  };

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "BYTESTART") {
      setCouponApplied(true);
      setCouponError("");
      showToast("Kupon 'BYTESTART' berhasil dipasang! Diskon 10% diterapkan.", "success");
    } else {
      setCouponError("Kode kupon tidak valid. Coba masukkan 'BYTESTART'");
    }
  };

  // Proceed to checkout redirection simulation
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Keranjang belanja kosong!", "info");
      return;
    }
    showToast("Mengalihkan ke halaman simulasi pembayaran...", "success");
    // Save checkout info to localStorage
    localStorage.setItem("bytestart_checkout_total", finalPrice.toString());
    localStorage.setItem("bytestart_checkout_items", JSON.stringify(cartIds));
    if (couponApplied) {
      localStorage.setItem("bytestart_checkout_coupon", "BYTESTART");
    } else {
      localStorage.removeItem("bytestart_checkout_coupon");
    }
    
    // Simulate redirection
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  };

  // Recommendations filtered: courses that are NOT in cart, NOT saved, and NOT in wishlist
  const recommendations = useMemo(() => {
    return coursesData.filter(
      c => !cartIds.includes(c.id) && !savedIds.includes(c.id)
    ).slice(0, 5);
  }, [cartIds, savedIds]);

  // Horizontal scroll handling for recommendation section
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${
              i < Math.floor(rating)
                ? "fill-[#FAEB92] stroke-[#FAEB92]"
                : "fill-white/10 stroke-white/10"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#892CDC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0314] min-h-screen text-white antialiased overflow-x-clip font-sans relative selection:bg-[#A156E3]/30 flex flex-col">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#52057B]/15 rounded-full blur-[150px] pointer-events-none z-0 select-none" />

      {/* Global CSS style block for scrollbar hiding */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow w-full">
        
        {/* Title */}
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {cartItems.length} {cartItems.length === 1 ? "Course" : "Courses"} in Cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#A156E3]">
              <ShoppingCart className="size-8" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Looks like you haven't added any programming courses to your cart yet. Explore our top catalogs to get started!
            </p>
            <Link 
              href="/courses" 
              className="px-6 py-3 rounded-full bg-[#892CDC] hover:bg-[#8e45cf] transition-all text-xs font-semibold shadow-lg shadow-[#892CDC]/20"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          /* Cart Content Layout: 2-Column Asymmetric */
          <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
            
            {/* LEFT COLUMN: Cart Item List (70%) */}
            <div className="w-full lg:w-[68%]">
              <div className="flex flex-col">
                {cartItems.map((course) => {
                  const hasDiscount = course.originalPrice > course.price;
                  return (
                    <div 
                      key={course.id}
                      className="flex flex-col sm:flex-row items-start gap-4 pb-6 mb-6 border-b border-slate-800 last:border-0 last:mb-0 last:pb-0"
                    >
                      {/* 1. Thumbnail Image */}
                      <Link 
                        href={`/courses/${course.id}`}
                        className="w-full sm:w-32 h-24 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-white/15 block relative hover:border-[#892CDC] transition-all"
                      >
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                          }}
                        />
                      </Link>

                      {/* 2. Detail Info (Flex-1) */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/courses/${course.id}`} className="hover:text-[#DDA5FF] transition-colors">
                          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5 font-light">
                          By ByteStart Team
                        </p>

                        {/* Rating block */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-xs font-bold text-[#FAEB92]">{course.rating.toFixed(1)}</span>
                          {renderStars(course.rating)}
                          <span className="text-[10px] text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
                        </div>

                        {/* Badges and meta */}
                        <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                          <span className="inline-flex items-center bg-[#892CDC]/20 text-[#DDA5FF] border border-[#892CDC]/40 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            Premium
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="size-3" />
                            {course.duration}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {course.lessons} lectures
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            • {course.level}
                          </span>
                        </div>
                      </div>

                      {/* 3. Action Links & Price Layout (Side-by-side on desktop, stacked on mobile) */}
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto shrink-0 border-t border-slate-900 pt-4 sm:pt-0 sm:border-t-0">
                        
                        {/* Price Area */}
                        <div className="text-left sm:text-right">
                          <div className="text-lg font-bold text-white flex items-center justify-start sm:justify-end gap-1.5 leading-none">
                            {formatRupiah(course.price)}
                            {hasDiscount && (
                              <Tag className="size-3.5 text-[#FAEB92] fill-[#FAEB92]/10" title="Diskon Aktif" />
                            )}
                          </div>
                          {hasDiscount && (
                            <div className="text-xs text-slate-400 line-through mt-0.5">
                              {formatRupiah(course.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons list (Vertical links) */}
                        <div className="flex flex-row sm:flex-col gap-x-4 gap-y-1 text-xs">
                          <button
                            onClick={() => handleRemoveItem(course.id, course.title)}
                            className="text-slate-400 hover:text-[#892CDC] flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer outline-none font-medium"
                          >
                            <Trash2 className="size-3" />
                            <span>Remove</span>
                          </button>
                          <button
                            onClick={() => handleSaveForLater(course.id, course.title)}
                            className="text-slate-400 hover:text-[#892CDC] flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer outline-none font-medium"
                          >
                            <Bookmark className="size-3" />
                            <span>Save for Later</span>
                          </button>
                          <button
                            onClick={() => handleMoveToWishlist(course.id, course.title)}
                            className="text-slate-400 hover:text-[#892CDC] flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer outline-none font-medium"
                          >
                            <Heart className="size-3" />
                            <span>Wishlist</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Price summary & Checkout box (30% Sticky) */}
            <div className="w-full lg:w-[32%] relative">
              <div className="sticky top-24 self-start w-full bg-white/[0.01] border border-[#52057B]/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                
                <h2 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-3 font-poppins">
                  Order Summary
                </h2>

                {/* Subtotal list */}
                <div className="space-y-2.5 mb-5 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="line-through text-slate-500">{formatRupiah(originalTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#DDA5FF] font-medium">
                    <span>Direct Discount:</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-400 font-medium animate-in fade-in">
                      <span className="flex items-center gap-1">
                        <Percent className="size-3.5" /> Coupon Discount (10%):
                      </span>
                      <span>-{formatRupiah(Math.round(totalPrice * 0.1))}</span>
                    </div>
                  )}
                </div>

                <hr className="border-white/5 mb-4" />

                {/* Total Price Group */}
                <div className="mb-5">
                  <span className="text-xs text-slate-400 font-medium">Total:</span>
                  <div className="text-3xl font-bold text-white mt-1 tracking-tight font-poppins">
                    {formatRupiah(finalPrice)}
                  </div>
                </div>

                {/* Primary CTA button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#892CDC] hover:bg-[#973fe8] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#892CDC]/20 cursor-pointer outline-none border-none text-sm tracking-wide"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4.5" />
                </button>

                <p className="text-[10px] text-slate-400/75 text-center mt-2.5">
                  You won't be charged yet
                </p>

                <hr className="border-white/5 my-5" />

                {/* Coupon System */}
                <div className="space-y-2.5">
                  {!showCouponInput ? (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="w-full py-2.5 rounded-xl border border-[#52057B] hover:bg-[#52057B]/20 text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer bg-transparent outline-none flex items-center justify-center gap-1.5"
                    >
                      <Tag className="size-3.5 text-[#DDA5FF]" />
                      <span>Apply Coupon</span>
                    </button>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="animate-in slide-in-from-top-2 duration-300">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon (e.g. BYTESTART)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={couponApplied}
                          className="flex-grow bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#A156E3]/60 focus:ring-1 focus:ring-[#A156E3]/35 rounded-xl h-9 px-3 text-xs outline-none transition-all placeholder-white/30 disabled:opacity-40 text-white"
                        />
                        <button
                          type="submit"
                          disabled={couponApplied || !couponCode}
                          className="h-9 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 disabled:opacity-40 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer outline-none active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {couponApplied && (
                        <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1 animate-in fade-in">
                          <Check className="size-3" />
                          Kupon 'BYTESTART' aktif (10% Off)
                        </span>
                      )}
                      
                      {couponError && (
                        <span className="text-[10px] text-red-400 font-medium mt-1.5 block animate-in fade-in">
                          {couponError}
                        </span>
                      )}

                      {!couponApplied && (
                        <span className="text-[9px] text-slate-500 block mt-1.5">
                          Try coupon code <span className="text-slate-400 font-bold">BYTESTART</span>.
                        </span>
                      )}
                    </form>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* SIMULATED SECTIONS: Saved for Later / Wishlist */}
        {mounted && (savedIds.length > 0 || wishlistIds.length > 0) && (
          <section className="mb-16 border-t border-white/5 pt-10">
            
            {savedIds.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-4 font-poppins">
                  Saved for Later ({savedIds.length} {savedIds.length === 1 ? "course" : "courses"})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedIds.map(id => {
                    const item = coursesData.find(c => c.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all">
                        <img src={item.image} className="w-16 h-12 rounded-lg object-cover shrink-0" alt="" />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-slate-400">{formatRupiah(item.price)}</span>
                          <div className="flex gap-3 mt-2 text-[10px]">
                            <button
                              onClick={() => handleMoveToCart(id, item.title, "saved")}
                              className="text-[#DDA5FF] hover:underline cursor-pointer bg-transparent border-none font-semibold"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromSaved(id, item.title)}
                              className="text-red-400/80 hover:text-red-400 hover:underline cursor-pointer bg-transparent border-none"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {wishlistIds.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 font-poppins">
                  Your Wishlist ({wishlistIds.length} {wishlistIds.length === 1 ? "course" : "courses"})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistIds.map(id => {
                    const item = coursesData.find(c => c.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all">
                        <img src={item.image} className="w-16 h-12 rounded-lg object-cover shrink-0" alt="" />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-slate-400">{formatRupiah(item.price)}</span>
                          <div className="flex gap-3 mt-2 text-[10px]">
                            <button
                              onClick={() => handleMoveToCart(id, item.title, "wishlist")}
                              className="text-[#DDA5FF] hover:underline cursor-pointer bg-transparent border-none font-semibold"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(id, item.title)}
                              className="text-red-400/80 hover:text-red-400 hover:underline cursor-pointer bg-transparent border-none"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </section>
        )}

        {/* BOTTOM SECTION: Recommendations ("You might also like") */}
        <section className="border-t border-white/5 pt-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white font-poppins">
                You might also like
              </h2>
              <p className="text-xs text-slate-400 mt-1">Recommended coding courses for you</p>
            </div>
            {/* Carousel Navigation Buttons */}
            {recommendations.length > 0 && (
              <div className="flex gap-2.5">
                <button
                  onClick={() => scroll("left")}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Recommendations slider */}
          {recommendations.length === 0 ? (
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl py-8 px-6 text-center text-xs text-white/40">
              No recommended courses available right now.
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex flex-row overflow-x-auto gap-5 pb-6 scroll-smooth no-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {recommendations.map((course) => (
                <div key={course.id} className="snap-start shrink-0 w-[290px] sm:w-[320px]">
                  <CourseCard course={course} onShowToast={showToast} />
                </div>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* TOAST NOTIFICATIONS */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* GLOBAL FOOTER */}
      <Footer />

    </div>
  );
}
