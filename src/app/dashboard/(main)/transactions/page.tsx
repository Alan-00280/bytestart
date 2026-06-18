"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronRight, 
  Printer, 
  Eye, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Award,
  X,
  Lock,
  Building2,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Transaction, dummyTransactions } from "@/data/transactionsMock";
import { coursesData, ownersData } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export default function TransactionsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [instructorFilter, setInstructorFilter] = useState("All"); // Only for Admin
  
  // Selected Transaction for Modal Detail
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Preference / Role states
  const currentRole = usePreferencesStore((s) => s.currentRole);

  useEffect(() => {
    setMounted(true);

    // Load transactions from localStorage or initialize with dummy history
    const savedTxs = localStorage.getItem("bytestart_transactions");
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        setTransactions(dummyTransactions);
        localStorage.setItem("bytestart_transactions", JSON.stringify(dummyTransactions));
      }
    } else {
      setTransactions(dummyTransactions);
      localStorage.setItem("bytestart_transactions", JSON.stringify(dummyTransactions));
    }
  }, []);

  // Toast Helper
  const showToast = (text: string, type: "success" | "info" | "role" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleCloseToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: check owner details for item
  const getItemOwnerId = (courseId: number): string => {
    const course = coursesData.find((c) => c.id === courseId);
    return course ? course.ownerId : "owner-1"; // default to owner-1 if custom added course
  };

  const getItemOwnerName = (courseId: number): string => {
    const ownerId = getItemOwnerId(courseId);
    return ownersData[ownerId]?.name || "ByteStart Team";
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

  // 1. Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.map((tx) => {
      // Filter the items within the transaction based on role/instructor
      let matchedItems = tx.items;
      
      if (currentRole === "owner") {
        // Owner only sees items belonging to "owner-1"
        matchedItems = tx.items.filter(item => getItemOwnerId(item.id) === "owner-1");
      } else if (currentRole === "admin" && instructorFilter !== "All") {
        // Admin filters items by selected instructor
        matchedItems = tx.items.filter(item => getItemOwnerId(item.id) === instructorFilter);
      }

      if (matchedItems.length === 0) return null;

      // Recalculate transaction totals based on role filtered items
      const roleTotalPrice = matchedItems.reduce((sum, item) => sum + item.price, 0);

      return {
        ...tx,
        items: matchedItems,
        totalPrice: roleTotalPrice
      };
    })
    .filter((tx): tx is Transaction => tx !== null)
    .filter((tx) => {
      // Text Search query filter (Invoice ID, buyer name, buyer email, or item titles)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tx.id.toLowerCase().includes(query) ||
        (tx.firstName && tx.firstName.toLowerCase().includes(query)) ||
        (tx.lastName && tx.lastName.toLowerCase().includes(query)) ||
        (tx.email && tx.email.toLowerCase().includes(query)) ||
        tx.items.some(item => item.title.toLowerCase().includes(query));

      // Payment method filter
      const matchesPayment = paymentFilter === "All" || tx.paymentType === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [transactions, currentRole, instructorFilter, searchQuery, paymentFilter]);

  // 2. Summary Statistics Calculations
  const stats = useMemo(() => {
    const totalTransactions = filteredTransactions.length;
    const grossRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.totalPrice, 0);
    const avgTicket = totalTransactions > 0 ? Math.round(grossRevenue / totalTransactions) : 0;

    // Best Selling Course calculation
    const courseCounts: Record<string, number> = {};
    filteredTransactions.forEach((tx) => {
      tx.items.forEach((item) => {
        courseCounts[item.title] = (courseCounts[item.title] || 0) + 1;
      });
    });

    let bestSeller = "-";
    let maxCount = 0;
    Object.entries(courseCounts).forEach(([title, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestSeller = title;
      }
    });

    return {
      grossRevenue,
      totalTransactions,
      avgTicket,
      bestSeller
    };
  }, [filteredTransactions]);

  // Financial calculations for detailed modal
  const modalFinancials = useMemo(() => {
    if (!selectedTx) return { subtotal: 0, tax: 0, total: 0 };
    const total = selectedTx.totalPrice;
    const subtotal = Math.round(total / 1.11);
    const tax = total - subtotal;
    return { subtotal, tax, total };
  }, [selectedTx]);

  // Print function inside modal
  const handlePrintSelected = () => {
    if (!selectedTx) return;
    showToast(`Membuka print layout untuk invoice ${selectedTx.id}`, "success");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Access guard check
  const hasAccess = currentRole === "admin" || currentRole === "owner";

  if (!mounted) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#892CDC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render unauthorized access screen
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-[70vh]">
        <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 animate-bounce">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="text-2xl font-poppins font-bold text-white mb-2">Akses Ditolak</h2>
        <p className="text-slate-400 max-w-md text-sm mb-6">
          Halaman ini hanya dapat diakses oleh peran Admin dan Course Owner. Silakan ubah peran Anda melalui panel role switcher.
        </p>
        <Link 
          href="/courses"
          className="bg-[#892CDC] hover:bg-[#A156E3] text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all active:scale-[0.98]"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white relative min-h-screen">
      
      {/* Dynamic @media print CSS styling */}
      <style>{`
        @media print {
          /* Hide everything on page except print container */
          body * {
            visibility: hidden !important;
          }
          #print-invoice-modal, #print-invoice-modal * {
            visibility: visible !important;
          }
          #print-invoice-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Print details overwrite */
          .print-text-black {
            color: black !important;
          }
          .print-text-gray {
            color: #4b5563 !important;
          }
          .print-bg-light {
            background-color: #f3f4f6 !important;
            color: black !important;
          }
          .print-border {
            border-color: #d1d5db !important;
          }
          .print-btn-hide {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 print-btn-hide">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#892CDC]/15 text-[#DDA5FF] border border-[#892CDC]/35 px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide">
            <Lock className="size-3" />
            Workspace Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">
            Kelola Transaksi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentRole === "admin" 
              ? "Dashboard Admin: Memonitor seluruh transaksi pembelian di platform." 
              : "Dashboard Instruktur: Memonitor pendapatan dan transaksi kelas Anda."}
          </p>
        </div>
      </div>

      {/* Rangkuman Keseluruhan Transaksi (Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 print-btn-hide">
        
        {/* Card 1: Gross Revenue */}
        <div className="bg-[#150a21] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="size-16 text-[#FAEB92]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 mb-3 tracking-wider">
            <DollarSign className="size-3.5 text-[#FAEB92]" />
            <span>Total Pendapatan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-poppins text-white leading-tight">
            {formatRupiah(stats.grossRevenue)}
          </h2>
          <p className="text-[10px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="size-3" />
            <span>+12.4% Bulan Ini</span>
          </p>
        </div>

        {/* Card 2: Total Transactions */}
        <div className="bg-[#150a21] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="size-16 text-[#A156E3]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 mb-3 tracking-wider">
            <ShoppingCart className="size-3.5 text-[#A156E3]" />
            <span>Jumlah Transaksi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-poppins text-white leading-tight">
            {stats.totalTransactions} <span className="text-xs font-normal text-white/40">Order</span>
          </h2>
          <p className="text-[10px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="size-3" />
            <span>+8.1% Bulan Ini</span>
          </p>
        </div>

        {/* Card 3: Avg Ticket Size */}
        <div className="bg-[#150a21] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="size-16 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 mb-3 tracking-wider">
            <TrendingUp className="size-3.5 text-cyan-400" />
            <span>Rerata Nilai Tiket</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-poppins text-white leading-tight">
            {formatRupiah(stats.avgTicket)}
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-2">
            Per transaksi terhitung
          </p>
        </div>

        {/* Card 4: Best Seller */}
        <div className="bg-[#150a21] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <Award className="size-16 text-[#FAEB92]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 mb-3 tracking-wider">
            <Award className="size-3.5 text-[#FAEB92]" />
            <span>Kelas Terlaris</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold font-poppins text-white leading-snug line-clamp-2 pr-6">
            {stats.bestSeller}
          </h2>
          <p className="text-[10px] text-[#DDA5FF] font-semibold mt-1">
            Produk Paling Populer
          </p>
        </div>

      </div>

      {/* Search & Filter Control Panel */}
      <div className="bg-[#150a21] border border-white/5 rounded-2xl p-5 mb-8 shadow-xl print-btn-hide">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 size-4" />
            <input
              type="text"
              placeholder="Cari ID Invoice, nama/email pembeli, atau judul kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 text-xs text-white placeholder-white/40 outline-none focus:border-[#A156E3]/50 focus:ring-1 focus:ring-[#A156E3]/20 transition-all font-light"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer bg-transparent border-none outline-none"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filters List */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end">
            
            {/* Instructor Owner Filter (Admin Only) */}
            {currentRole === "admin" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Instruktur:</span>
                <select
                  value={instructorFilter}
                  onChange={(e) => setInstructorFilter(e.target.value)}
                  className="bg-[#220e36] border border-white/10 text-white rounded-xl h-10 px-3 text-xs focus:border-[#A156E3]/50 focus:ring-1 focus:ring-[#A156E3]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Instruktur</option>
                  <option value="owner-1">Luthfi Alan (owner-1)</option>
                  <option value="owner-2">Olivia Rhye (owner-2)</option>
                </select>
              </div>
            )}

            {/* Payment Method Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Metode:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-[#220e36] border border-white/10 text-white rounded-xl h-10 px-3 text-xs focus:border-[#A156E3]/50 focus:ring-1 focus:ring-[#A156E3]/20 outline-none cursor-pointer"
              >
                <option value="All">Semua Metode</option>
                <option value="BNI VA">BNI VA</option>
                <option value="GoPay">GoPay</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Transaction List Table */}
      <div className="bg-[#150a21] border border-white/5 rounded-2xl shadow-xl overflow-hidden print-btn-hide">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-xs text-left text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-5 py-4">ID Invoice</th>
                <th className="px-4 py-4">Pembeli</th>
                <th className="px-4 py-4 text-center">Tanggal</th>
                <th className="px-4 py-4">Materi Kelas</th>
                <th className="px-4 py-4 text-center">Metode</th>
                <th className="px-4 py-4 text-right">Harga Total</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-light">
                    Tidak ada data transaksi yang cocok dengan pencarian / filter aktif.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                    
                    {/* Invoice ID */}
                    <td className="px-5 py-4 font-mono font-bold text-white whitespace-nowrap">
                      {tx.id}
                    </td>
                    
                    {/* Buyer Details */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">
                        {tx.firstName ? `${tx.firstName} ${tx.lastName}` : "Luthfi Alan Perdana"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {tx.email || "luthfialan@bytestart.com"}
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td className="px-4 py-4 text-center text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    
                    {/* Items Purchased List */}
                    <td className="px-4 py-4">
                      <div className="space-y-1 max-w-[240px] md:max-w-[320px]">
                        {tx.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="font-semibold text-slate-200 truncate block">
                              {item.title}
                            </span>
                            {currentRole === "admin" && (
                              <span className="text-[9px] text-[#DDA5FF] font-medium">
                                Oleh: {getItemOwnerName(item.id)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    
                    {/* Payment Type */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className="bg-[#892CDC]/10 text-[#DDA5FF] border border-[#892CDC]/20 px-2 py-1 rounded text-[10px] font-semibold">
                        {tx.paymentType}
                      </span>
                    </td>
                    
                    {/* Total Price */}
                    <td className="px-4 py-4 text-right font-bold text-white whitespace-nowrap">
                      {formatRupiah(tx.totalPrice)}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        
                        {/* View Button */}
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#A156E3]/40 text-white flex items-center justify-center transition-all cursor-pointer outline-none"
                          title="Lihat Detail Invoice"
                          aria-label="View Invoice Details"
                        >
                          <Eye className="size-4" />
                        </button>
                        
                        {/* Print Button */}
                        <button
                          onClick={() => {
                            setSelectedTx(tx);
                            setTimeout(() => {
                              window.print();
                            }, 100);
                          }}
                          className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 text-white flex items-center justify-center transition-all cursor-pointer outline-none"
                          title="Cetak Invoice"
                          aria-label="Print Invoice"
                        >
                          <Printer className="size-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL INVOICE OVERLAY MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print-bg-light">
          
          <div 
            id="print-invoice-modal"
            className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 md:p-16 shadow-2xl relative my-auto print-bg-light print-border print-text-black"
          >
            
            {/* Modal Close Button (Print-Hidden) */}
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer outline-none print-btn-hide"
              aria-label="Close Modal"
            >
              <X className="size-4" />
            </button>

            {/* Modal Contents (Matching Invoice Layout) */}
            <div className="flex flex-col">
              
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-white/5 print-border pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-poppins font-bold text-white print-text-black tracking-tight mb-1">
                    Invoice
                  </h2>
                  <p className="text-[11px] text-slate-400 print-text-gray font-light">
                    Date issued: {selectedTx.date}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-[#FAEB92]" />
                  <span className="font-poppins font-bold text-md text-white print-text-black uppercase tracking-wide">
                    ByteStart
                  </span>
                </div>
              </div>

              {/* Identity details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-white/5 print-border text-xs mb-6 print-text-black">
                
                {/* Seller */}
                <div className="space-y-1.5 text-slate-300 print-text-gray">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                    Sold By
                  </span>
                  <h4 className="font-bold text-white print-text-black text-sm">ByteStart, Inc.</h4>
                  <p className="font-light">Jl. Pendidikan Teknologi Raya No. 42</p>
                  <p className="font-light">Yogyakarta, Indonesia</p>
                </div>

                {/* Buyer */}
                <div className="space-y-1.5 text-slate-300 print-text-gray sm:text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                    Sold To
                  </span>
                  <h4 className="font-bold text-white print-text-black text-sm">
                    {selectedTx.firstName ? `${selectedTx.firstName} ${selectedTx.lastName}` : "Luthfi Alan Perdana"}
                  </h4>
                  {selectedTx.email && (
                    <p className="font-light font-mono text-slate-400 print-text-gray break-all">
                      {selectedTx.email}
                    </p>
                  )}
                  <div className="pt-2.5 space-y-0.5">
                    <p className="font-mono text-slate-300 print-text-black font-bold">
                      Invoice #: {selectedTx.id}
                    </p>
                    <p className="font-light">
                      Payment Method: <span className="font-semibold text-white print-text-black">{selectedTx.paymentType}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Items Table details */}
              <div className="mb-6 print-text-black">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Invoice items breakdown
                </span>
                
                <div className="bg-slate-900/40 border border-slate-800 print-border rounded-xl overflow-hidden">
                  <table className="min-w-full text-xs text-left text-slate-300 print-text-black">
                    <thead className="bg-white/[0.02] border-b border-slate-800 print-border text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Course Item</th>
                        {currentRole === "admin" && <th className="px-4 py-2.5">Owner</th>}
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print-border font-light">
                      {selectedTx.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 font-semibold text-white print-text-black max-w-[200px] sm:max-w-md truncate">
                            {item.title}
                          </td>
                          {currentRole === "admin" && (
                            <td className="px-4 py-3 text-slate-400 print-text-gray">
                              {getItemOwnerName(item.id)}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">1</td>
                          <td className="px-4 py-3 text-right font-bold text-white print-text-black">
                            {formatRupiah(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculations blocks */}
              <div className="flex justify-end text-xs mb-8 print-text-black">
                <div className="w-full sm:w-64 space-y-2 text-right">
                  <div className="flex justify-between text-slate-400 print-text-gray font-medium">
                    <span>Subtotal:</span>
                    <span className="text-slate-200 print-text-black">{formatRupiah(modalFinancials.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 print-text-gray font-medium">
                    <span>PPN Tax (11%):</span>
                    <span className="text-slate-200 print-text-black">{formatRupiah(modalFinancials.tax)}</span>
                  </div>
                  <div className="border-t border-white/5 print-border my-2 pt-2.5 flex justify-between items-baseline font-bold">
                    <span className="text-white print-text-black">Total Paid:</span>
                    <span className="text-base text-[#FAEB92] print-text-black">{formatRupiah(modalFinancials.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons footer (Print-Hidden) */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-5 print-btn-hide">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] outline-none"
                >
                  Close
                </button>
                <button
                  onClick={handlePrintSelected}
                  className="h-10 px-6 rounded-xl bg-[#892CDC] hover:bg-[#993ee6] text-white text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] outline-none flex items-center gap-1.5 shadow-lg shadow-[#892CDC]/10"
                >
                  <Printer className="size-4" />
                  <span>Print Invoice</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Toast Notifier System */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

    </div>
  );
}
