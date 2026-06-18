"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Check, 
  CreditCard, 
  Smartphone, 
  Store, 
  Building2, 
  ChevronDown, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Calendar,
  User
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";
import { coursesData, Course, ownersData } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Checkout items state loaded from localStorage
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [finalPrice, setFinalPrice] = useState(0);

  // Form states
  const [country, setCountry] = useState("Indonesia");
  const [activePaymentMethod, setActivePaymentMethod] = useState("bank");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Success screen modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  // Navigation & Role states
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);

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

  // Load checkout information on mount
  useEffect(() => {
    setMounted(true);

    // Get cart items and final price
    const savedCart = localStorage.getItem("bytestart_cart");
    const checkoutTotal = localStorage.getItem("bytestart_checkout_total");
    
    let ids: number[] = [];
    if (savedCart) {
      ids = JSON.parse(savedCart);
      setCartIds(ids);
    } else {
      // Initialize with default [1, 2, 3] if accessing directly
      ids = [1, 2, 3];
      setCartIds(ids);
      localStorage.setItem("bytestart_cart", JSON.stringify(ids));
    }

    if (checkoutTotal) {
      setFinalPrice(parseInt(checkoutTotal));
    } else {
      // Calculate from course items directly if total isn't set in localStorage
      const items = ids.map(id => coursesData.find(c => c.id === id)).filter((c): c is Course => !!c);
      const total = items.reduce((acc, curr) => acc + curr.price, 0);
      setFinalPrice(total);
    }

    // Generate random invoice ID on load
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setInvoiceId(`BS-${randomNum}`);
    
    // Set current date formatted
    const date = new Date();
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }) + ` - ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
    setTransactionDate(formattedDate);
  }, []);

  // Map IDs to course objects
  const checkoutItems = useMemo(() => {
    return cartIds
      .map(id => coursesData.find(c => c.id === id))
      .filter((c): c is Course => !!c);
  }, [cartIds]);

  // Original total price before coupons or discounts
  const originalTotalPrice = useMemo(() => {
    return checkoutItems.reduce((acc, curr) => acc + curr.originalPrice, 0);
  }, [checkoutItems]);

  const discountAmount = useMemo(() => {
    return originalTotalPrice - finalPrice;
  }, [originalTotalPrice, finalPrice]);

  // Format currency Helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle role change
  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    showToast(`Role disimulasikan sebagai: ${roleName}`, "role");
  };

  // Validate fields for Bank Transfer option
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (activePaymentMethod === "bank") {
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Complete Payment Action
  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkoutItems.length === 0) {
      showToast("Tidak ada item untuk dibeli!", "info");
      return;
    }

    if (!validateForm()) {
      showToast("Silakan lengkapi data formulir yang diperlukan.", "info");
      return;
    }

    // Process payment simulation
    showToast("Memproses pembayaran aman...", "info");
    
    setTimeout(() => {
      // Trigger success screen modal
      setShowSuccessModal(true);
      
      // Save purchased courses to simulated active student inventory
      const purchased = localStorage.getItem("bytestart_purchased_courses");
      let purchasedIds: number[] = [];
      if (purchased) {
        try { purchasedIds = JSON.parse(purchased); } catch(e){}
      }
      const newPurchased = Array.from(new Set([...purchasedIds, ...cartIds]));
      localStorage.setItem("bytestart_purchased_courses", JSON.stringify(newPurchased));

      // Save Transaction to Purchase History
      const savedTxs = localStorage.getItem("bytestart_transactions");
      let transactionsList = [];
      if (savedTxs) {
        try { transactionsList = JSON.parse(savedTxs); } catch(e){}
      }
      
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const date = new Date();
      const dateStr = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

      const newTx = {
        id: invoiceId,
        date: dateStr,
        totalPrice: finalPrice,
        paymentType: activePaymentMethod === "bank" ? "BNI VA" : activePaymentMethod.toUpperCase(),
        items: checkoutItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          originalPrice: item.originalPrice
        })),
        couponApplied: localStorage.getItem("bytestart_checkout_coupon") || undefined,
        firstName,
        lastName,
        email
      };

      transactionsList.unshift(newTx);
      localStorage.setItem("bytestart_transactions", JSON.stringify(transactionsList));
    }, 1200);
  };

  // Close success modal and empty the cart
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Empty the cart
    localStorage.removeItem("bytestart_cart");
    localStorage.removeItem("bytestart_checkout_total");
    localStorage.removeItem("bytestart_checkout_items");
    
    // Dispatch updated cart event to clean Navbar badge
    window.dispatchEvent(new Event("bytestart_cart_updated"));
    
    // Redirect to courses catalog
    router.push("/courses");
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

      {/* Confetti Animation wrapper (Confetti overlay if payment success) */}
      {showSuccessModal && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
          {/* Create multiple custom animated confetti items */}
          {[...Array(50)].map((_, i) => {
            const randomLeft = Math.random() * 100; // %
            const randomDelay = Math.random() * 4; // seconds
            const randomSize = Math.random() * 8 + 5; // px
            const randomRotate = Math.random() * 360; // deg
            const colors = ["bg-purple-500", "bg-indigo-400", "bg-[#FAEB92]", "bg-pink-500", "bg-[#892CDC]", "bg-teal-400"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div 
                key={i} 
                className={`absolute rounded-sm opacity-90 animate-fall ${randomColor}`}
                style={{
                  left: `${randomLeft}%`,
                  top: `-20px`,
                  width: `${randomSize}px`,
                  height: `${randomSize * 1.5}px`,
                  transform: `rotate(${randomRotate}deg)`,
                  animation: `fall 4s linear infinite`,
                  animationDelay: `${randomDelay}s`
                }}
              />
            );
          })}
          <style>{`
            @keyframes fall {
              0% {
                top: -20px;
                transform: translateY(0) rotate(0deg);
              }
              100% {
                top: 105vh;
                transform: translateY(0) rotate(720deg);
              }
            }
          `}</style>
        </div>
      )}

      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* MAIN LAYOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow w-full">
        
        {/* Navigation back link */}
        <div className="mb-6 flex items-center">
          <Link 
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#DDA5FF] transition-colors group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Shopping Cart</span>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-white tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate your secure mock purchase
          </p>
        </div>

        {/* 2-Column Asymmetric layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          
          {/* LEFT COLUMN: Billing & Payment (65%) */}
          <div className="w-full lg:w-[65%] space-y-8">
            
            {/* Billing Address Section */}
            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-md">
              <h2 className="font-bold text-xl text-white mb-4 font-poppins flex items-center gap-2">
                <span>Billing Address</span>
              </h2>
              
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Country / Region
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-12 bg-white/[0.03] border border-slate-800 rounded-xl px-4 text-sm outline-none focus:border-[#A156E3]/60 focus:ring-1 focus:ring-[#A156E3]/25 transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="Indonesia" className="bg-[#190b24] text-white">Indonesia</option>
                    <option value="Singapore" className="bg-[#190b24] text-white">Singapore</option>
                    <option value="Malaysia" className="bg-[#190b24] text-white">Malaysia</option>
                    <option value="United States" className="bg-[#190b24] text-white">United States</option>
                    <option value="United Kingdom" className="bg-[#190b24] text-white">United Kingdom</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </section>

            {/* Payment Method Accordion Section */}
            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-xl text-white font-poppins">
                  Payment Method
                </h2>
                <span className="text-xs text-slate-400 flex items-center gap-1 bg-white/5 border border-white/10 py-1 px-2.5 rounded-full font-medium">
                  <Lock className="size-3 text-emerald-400" />
                  Secure and encrypted
                </span>
              </div>

              {/* Accordion / List wrapper */}
              <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 bg-black/40">
                
                {/* Opsi 1: Bank Transfer (Terbuka secara default) */}
                <div className={`transition-colors ${activePaymentMethod === "bank" ? "bg-white/[0.02]" : ""}`}>
                  <label className="flex items-center gap-3.5 p-4 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={activePaymentMethod === "bank"}
                      onChange={() => setActivePaymentMethod("bank")}
                      className="accent-[#892CDC] size-4.5 cursor-pointer"
                    />
                    <Building2 className={`size-5 ${activePaymentMethod === "bank" ? "text-[#DDA5FF]" : "text-slate-400"}`} />
                    <span className="text-sm font-semibold text-white flex-grow">
                      Bank Transfer / Virtual Account
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono uppercase tracking-wider hidden sm:block">
                      Instant verification
                    </span>
                  </label>

                  {/* Expandable panel details */}
                  {activePaymentMethod === "bank" && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 animate-in fade-in duration-300">
                      <p className="text-xs text-[#FAEB92] mb-4 font-light">
                        * Pilihlah opsi ini untuk simulasi pengisian biodata penagihan.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                        {/* First Name */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                            First Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`w-full h-11 bg-white/[0.02] border rounded-xl px-4 text-xs outline-none transition-all text-white placeholder-white/20 ${
                              formErrors.firstName ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-[#A156E3]/60"
                            }`}
                          />
                          {formErrors.firstName && (
                            <span className="text-[10px] text-red-400 mt-1 block">{formErrors.firstName}</span>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Last Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={`w-full h-11 bg-white/[0.02] border rounded-xl px-4 text-xs outline-none transition-all text-white placeholder-white/20 ${
                              formErrors.lastName ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-[#A156E3]/60"
                            }`}
                          />
                          {formErrors.firstName && (
                            <span className="text-[10px] text-red-400 mt-1 block">{formErrors.lastName}</span>
                          )}
                        </div>

                        {/* Email Address */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="johndoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full h-11 bg-white/[0.02] border rounded-xl px-4 text-xs outline-none transition-all text-white placeholder-white/20 ${
                              formErrors.email ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-[#A156E3]/60"
                            }`}
                          />
                          {formErrors.email && (
                            <span className="text-[10px] text-red-400 mt-1 block">{formErrors.email}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Opsi 2: Credit Card */}
                <div className={`transition-colors ${activePaymentMethod === "card" ? "bg-white/[0.02]" : ""}`}>
                  <label className="flex items-center gap-3.5 p-4 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={activePaymentMethod === "card"}
                      onChange={() => setActivePaymentMethod("card")}
                      className="accent-[#892CDC] size-4.5 cursor-pointer"
                    />
                    <CreditCard className={`size-5 ${activePaymentMethod === "card" ? "text-[#DDA5FF]" : "text-slate-400"}`} />
                    <span className="text-sm font-semibold text-white flex-grow">
                      Cards (Visa, Mastercard, JCB)
                    </span>
                  </label>
                  
                  {activePaymentMethod === "card" && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 text-xs text-slate-400 font-light animate-in fade-in duration-300">
                      Metode kartu kredit dinonaktifkan dalam mode pratinjau. Silakan gunakan <strong className="text-white">Bank Transfer</strong> untuk mendemokan pembayaran.
                    </div>
                  )}
                </div>

                {/* Opsi 3: E-Wallet */}
                <div className={`transition-colors ${activePaymentMethod === "wallet" ? "bg-white/[0.02]" : ""}`}>
                  <label className="flex items-center gap-3.5 p-4 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={activePaymentMethod === "wallet"}
                      onChange={() => setActivePaymentMethod("wallet")}
                      className="accent-[#892CDC] size-4.5 cursor-pointer"
                    />
                    <Smartphone className={`size-5 ${activePaymentMethod === "wallet" ? "text-[#DDA5FF]" : "text-slate-400"}`} />
                    <span className="text-sm font-semibold text-white flex-grow">
                      E-Wallet (OVO, Dana, LinkAja)
                    </span>
                  </label>
                  
                  {activePaymentMethod === "wallet" && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 text-xs text-slate-400 font-light animate-in fade-in duration-300">
                      Metode dompet digital dinonaktifkan dalam mode pratinjau. Silakan gunakan <strong className="text-white">Bank Transfer</strong> untuk mendemokan pembayaran.
                    </div>
                  )}
                </div>

                {/* Opsi 4: Convenience Store */}
                <div className={`transition-colors ${activePaymentMethod === "store" ? "bg-white/[0.02]" : ""}`}>
                  <label className="flex items-center gap-3.5 p-4 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={activePaymentMethod === "store"}
                      onChange={() => setActivePaymentMethod("store")}
                      className="accent-[#892CDC] size-4.5 cursor-pointer"
                    />
                    <Store className={`size-5 ${activePaymentMethod === "store" ? "text-[#DDA5FF]" : "text-slate-400"}`} />
                    <span className="text-sm font-semibold text-white flex-grow">
                      Convenience Store (Alfamart, Indomaret)
                    </span>
                  </label>
                  
                  {activePaymentMethod === "store" && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 text-xs text-slate-400 font-light animate-in fade-in duration-300">
                      Metode gerai ritel dinonaktifkan dalam mode pratinjau. Silakan gunakan <strong className="text-white">Bank Transfer</strong> untuk mendemokan pembayaran.
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* Order Details (Bottom Left) */}
            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-md">
              <h2 className="font-bold text-lg text-white mb-5 font-poppins">
                Order Details ({checkoutItems.length} {checkoutItems.length === 1 ? "course" : "courses"})
              </h2>

              <div className="space-y-4">
                {checkoutItems.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={course.image} 
                        className="w-12 h-12 rounded object-cover shrink-0 border border-white/10" 
                        alt="" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white leading-tight truncate">
                          {course.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-light">
                          By {ownersData[course.ownerId]?.name || "ByteStart Team"} • {course.duration}
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-xs font-bold text-white shrink-0">
                      {formatRupiah(course.price)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Order Summary Sidebar (35%) */}
          <div className="w-full lg:w-[35%] relative">
            <div className="sticky top-24 self-start bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm w-full">
              
              <h2 className="font-bold text-xl text-white mb-4 font-poppins">
                Order summary
              </h2>

              {/* Price details list */}
              <div className="space-y-2.5 mb-5 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span className="line-through text-slate-500">{formatRupiah(originalTotalPrice)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#DDA5FF] font-medium">
                    <span>Discount applied:</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                
                <hr className="border-white/5 my-3" />

                {/* Total price print */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Total ({checkoutItems.length} {checkoutItems.length === 1 ? "course" : "courses"}):
                  </span>
                  <span className="text-2xl font-bold text-white tracking-tight font-poppins">
                    {formatRupiah(finalPrice)}
                  </span>
                </div>
              </div>

              {/* Terms checkbox helper description */}
              <p className="text-[10px] text-slate-400/75 leading-relaxed mb-4">
                By completing your purchase, you agree to these <a href="#" className="text-[#DDA5FF] hover:underline">Terms of Use</a>.
              </p>

              {/* Primary Complete Payment CTA */}
              <button
                onClick={handleCompletePayment}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#892CDC] hover:bg-[#973fe8] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#892CDC]/20 cursor-pointer outline-none border-none text-sm tracking-wide"
              >
                <Lock className="size-4" />
                <span>Complete Payment</span>
              </button>

              <hr className="border-white/5 my-5" />

              {/* 30-Day Guarantee Banner */}
              <div className="flex gap-3 items-start text-xs text-slate-300 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <ShieldCheck className="size-6 text-[#FAEB92] shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white">30-Day Money-Back Guarantee</h4>
                  <p className="text-[10px] text-slate-400 leading-normal font-light">
                    Not satisfied? Get a full refund within 30 days. Simple and straightforward!
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* TOAST SYSTEM */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* GLOBAL FOOTER */}
      <Footer />

      {/* SUCCESS TRANSACTION MODAL DIALOG */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          
          <div className="bg-[#12071f] border border-[#52057B]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Top Glowing Circle */}
            <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-48 h-48 bg-[#892CDC]/25 rounded-full blur-2xl pointer-events-none" />

            {/* Success Icon Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5 text-emerald-400">
              <Check className="size-8" />
            </div>

            {/* Header Success text */}
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 font-light">
              Terima kasih atas transaksi Anda. Kursus telah berhasil ditambahkan ke inventori belajar Anda.
            </p>

            {/* Dummy Struk / Invoice Box */}
            <div className="bg-[#190c2a] border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-3.5">
              
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Sparkles className="size-3 text-[#FAEB92]" /> Invoice ID:
                </span>
                <span className="font-mono font-bold text-[#FAEB92]">{invoiceId}</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                {/* Date */}
                <div className="text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="size-3 text-slate-500" /> Date:
                </div>
                <div className="text-white font-medium text-right break-all">
                  {transactionDate}
                </div>

                {/* Purchaser Name */}
                <div className="text-slate-400 flex items-center gap-1 font-medium">
                  <User className="size-3 text-slate-500" /> Purchaser:
                </div>
                <div className="text-white font-semibold text-right">
                  {activePaymentMethod === "bank" && firstName ? `${firstName} ${lastName}` : "ByteStart Student"}
                </div>

                {/* Email */}
                {activePaymentMethod === "bank" && email && (
                  <>
                    <div className="text-slate-400 flex items-center gap-1 font-medium">
                      Email:
                    </div>
                    <div className="text-white font-medium text-right truncate">
                      {email}
                    </div>
                  </>
                )}

                {/* Payment Method */}
                <div className="text-slate-400 flex items-center gap-1 font-medium">
                  Method:
                </div>
                <div className="text-white font-medium text-right capitalize">
                  {activePaymentMethod === "bank" ? "Bank Transfer" : activePaymentMethod}
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 mt-1.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Items Purchased ({checkoutItems.length}):
                </span>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1.5">
                  {checkoutItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300 truncate max-w-[240px] font-medium">
                        {item.title}
                      </span>
                      <span className="text-white font-bold shrink-0 ml-2">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-3.5 flex justify-between items-baseline font-bold">
                <span className="text-xs text-white">Amount Paid:</span>
                <span className="text-lg text-emerald-400 font-poppins">{formatRupiah(finalPrice)}</span>
              </div>

            </div>

            {/* Back Button Action */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#892CDC] hover:bg-[#973fe8] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#892CDC]/20 cursor-pointer outline-none border-none text-sm tracking-wide"
            >
              <ShoppingBag className="size-4" />
              <span>Back to Courses</span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
