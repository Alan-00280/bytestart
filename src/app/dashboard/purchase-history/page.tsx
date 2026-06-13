"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  ChevronRight, 
  ArrowLeftRight,
  FileText,
  Printer,
  FileCode
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";

interface TransactionItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
}

interface Transaction {
  id: string;
  date: string;
  totalPrice: number;
  paymentType: string;
  items: TransactionItem[];
  couponApplied?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"purchases" | "refunds">("purchases");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState("public");
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

  // Initialize data on mount
  useEffect(() => {
    setMounted(true);

    const savedRole = localStorage.getItem("bytestart_role");
    if (savedRole) {
      setCurrentRole(savedRole);
    }

    // Load transactions from localStorage or initialize with dummy history
    const savedTxs = localStorage.getItem("bytestart_transactions");
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        initializeDummyTransactions();
      }
    } else {
      initializeDummyTransactions();
    }
  }, []);

  const initializeDummyTransactions = () => {
    const dummyTransactions: Transaction[] = [
      {
        id: "BS-666D4B7",
        date: "Jan 4, 2026",
        totalPrice: 149000,
        paymentType: "BNI VA",
        items: [
          {
            id: 11,
            title: "Tailwind CSS v4 & Creative Layouts Masterclass",
            price: 149000,
            originalPrice: 649000
          }
        ],
        couponApplied: "KEELEARNING",
        firstName: "Luthfi Alan",
        lastName: "Perdana",
        email: "luthfialan@bytestart.com"
      },
      {
        id: "BS-2850192",
        date: "Dec 20, 2025",
        totalPrice: 899000,
        paymentType: "GoPay",
        items: [
          {
            id: 1,
            title: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
            price: 899000,
            originalPrice: 1299000
          }
        ]
      },
      {
        id: "BS-1928401",
        date: "Nov 15, 2025",
        totalPrice: 1598000,
        paymentType: "BNI VA",
        items: [
          {
            id: 2,
            title: "Framer Full Mastery & UI Motion 2026",
            price: 999000,
            originalPrice: 1499000
          },
          {
            id: 4,
            title: "Go REST API & Microservices Mastery",
            price: 599000,
            originalPrice: 899000
          }
        ]
      }
    ];
    setTransactions(dummyTransactions);
    localStorage.setItem("bytestart_transactions", JSON.stringify(dummyTransactions));
  };

  // Simulate Invoice Action
  const handleSimulateInvoice = (txId: string) => {
    showToast(`Membuka Dokumen Invoice ${txId} (Simulasi PDF View)`, "info");
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

      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onShowToast={showToast}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow w-full">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <ChevronRight className="size-3 text-slate-600" />
          <span className="text-slate-300 font-semibold">Dashboard</span>
          <ChevronRight className="size-3 text-slate-600" />
          <span className="text-white">Purchase History</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-white tracking-tight">
            Purchase history
          </h1>
        </div>

        {/* Tabs Control */}
        <div className="flex border-b border-slate-800 mb-8 w-full">
          <button
            onClick={() => setActiveTab("purchases")}
            className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 cursor-pointer transition-all outline-none ${
              activeTab === "purchases"
                ? "border-[#892CDC] text-[#DDA5FF] bg-white/[0.01]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Purchases
          </button>
          
          <button
            onClick={() => {
              setActiveTab("refunds");
              showToast("Simulasi melihat daftar refund (kosong)", "info");
            }}
            className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 cursor-pointer transition-all outline-none ${
              activeTab === "refunds"
                ? "border-[#892CDC] text-[#DDA5FF] bg-white/[0.01]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Refunds
          </button>
        </div>

        {/* Purchases List */}
        {activeTab === "refunds" ? (
          /* Refunds Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center mb-10">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-500">
              <ArrowLeftRight className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">No refund records</h2>
            <p className="text-slate-400 text-xs max-w-xs font-light">
              You haven't requested any refunds on ByteStart.
            </p>
          </div>
        ) : transactions.length === 0 ? (
          /* Purchases Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center mb-10">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#A156E3]">
              <ShoppingCart className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">No transactions yet</h2>
            <p className="text-slate-400 text-xs max-w-xs mb-6 font-light">
              It looks like you haven't bought any courses yet.
            </p>
            <Link 
              href="/courses" 
              className="px-5 py-2.5 rounded-full bg-[#892CDC] hover:bg-[#8e45cf] transition-all text-xs font-semibold shadow-lg shadow-[#892CDC]/20"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          /* Transaction Row Grid Layout */
          <div className="space-y-4">
            
            {/* Table Header (Hidden on small screens) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Date</div>
              <div className="col-span-2 text-center">Total Price</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Transaction Rows */}
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                className="bg-white/[0.01] hover:bg-white/[0.02] border border-[#52057B]/30 hover:border-[#892CDC]/30 rounded-2xl p-5 md:px-6 md:py-5 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center transition-all duration-300 gap-4"
              >
                {/* 1. Item Detail (Flex Column / Col-Span-6) */}
                <div className="col-span-6 flex gap-4 items-start min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#892CDC]/10 border border-[#892CDC]/25 text-[#DDA5FF] flex items-center justify-center shrink-0">
                    <ShoppingCart className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-grow pt-0.5">
                    {/* Display first item title, and show +X more if multi-item */}
                    <Link 
                      href={`/dashboard/receipt/${tx.id}`}
                      className="text-sm font-bold text-slate-200 hover:text-[#DDA5FF] transition-colors leading-snug line-clamp-1"
                    >
                      {tx.items[0]?.title || "ByteStart Course Package"}
                    </Link>
                    
                    {tx.items.length > 1 && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        and {tx.items.length - 1} other {tx.items.length - 1 === 1 ? "course" : "courses"}
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-slate-500 block mt-1">
                      ID: {tx.id}
                    </span>
                  </div>
                </div>

                {/* 2. Date (Col-Span-2) */}
                <div className="col-span-2 flex md:justify-center items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-3 md:pt-0 md:border-t-0">
                  <span className="md:hidden font-semibold text-slate-500">Date:</span>
                  <span>{tx.date}</span>
                </div>

                {/* 3. Total Price & Payment Type (Col-Span-2) */}
                <div className="col-span-2 flex flex-col md:justify-center md:items-center justify-between text-xs md:text-center gap-1 border-t border-slate-900 pt-3 md:pt-0 md:border-t-0 flex-row md:flex-col">
                  <span className="md:hidden font-semibold text-slate-500">Total Paid:</span>
                  <div className="text-right md:text-center">
                    <div className="font-bold text-slate-200">{formatRupiah(tx.totalPrice)}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{tx.paymentType}</div>
                  </div>
                </div>

                {/* 4. Action Buttons (Col-Span-2) */}
                <div className="col-span-2 flex gap-2.5 md:justify-end justify-start border-t border-slate-900 pt-4 md:pt-0 md:border-t-0">
                  {/* Link to Receipt Detail */}
                  <Link 
                    href={`/dashboard/receipt/${tx.id}`}
                    className="h-9 px-4 rounded-xl border border-slate-800 hover:border-[#892CDC] hover:bg-[#892CDC]/5 text-xs text-slate-300 hover:text-white transition-all duration-300 font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="size-3 text-[#DDA5FF]" />
                    <span>Receipt</span>
                  </Link>

                  {/* Simulate Invoice printing */}
                  <button
                    onClick={() => handleSimulateInvoice(tx.id)}
                    className="h-9 px-4 rounded-xl border border-slate-800 hover:border-[#892CDC] hover:bg-[#892CDC]/5 text-xs text-slate-300 hover:text-white transition-all duration-300 font-semibold flex items-center justify-center gap-1 cursor-pointer bg-transparent outline-none"
                  >
                    <FileCode className="size-3 text-[#DDA5FF]" />
                    <span>Invoice</span>
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>

      {/* TOAST SYSTEM */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* GLOBAL FOOTER */}
      <Footer />

    </div>
  );
}
