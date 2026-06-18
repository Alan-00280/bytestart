"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Printer, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  Building2,
  Lock,
  Download,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/layouts/Navbar";
import { Toast, ToastMessage } from "@/components/common/Toast";
import { Footer } from "@/components/layouts/Footer";
// import { coursesData, Course } from "@/data/coursesMock";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { Transaction, dummyTransactions } from "@/data/transactionsMock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReceiptPage({ params }: PageProps) {
  const { id: invoiceId } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // Navigation & Role states
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
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

  // Tax and subtotal calculations
  const financialDetails = useMemo(() => {
    if (!transaction) return { subtotal: 0, tax: 0, total: 0 };
    
    // Subtotal before 11% PPN (Indonesian standard)
    // subtotal + tax = total => subtotal + 0.11 * subtotal = total => 1.11 * subtotal = total
    const total = transaction.totalPrice;
    const subtotal = Math.round(total / 1.11);
    const tax = total - subtotal;

    return { subtotal, tax, total };
  }, [transaction]);

  // Load transaction on mount
  useEffect(() => {
    setMounted(true);

    // Try to load transaction matching id from localStorage
    const savedTxs = localStorage.getItem("bytestart_transactions");
    let txs: Transaction[] = [];
    if (savedTxs) {
      try { txs = JSON.parse(savedTxs); } catch(e){}
    }

    // Find transaction
    const foundTx = txs.find(t => t.id.toLowerCase() === invoiceId.toLowerCase());
    
    if (foundTx) {
      setTransaction(foundTx);
    } else {
      const foundDummy = dummyTransactions.find(t => t.id.toLowerCase() === invoiceId.toLowerCase());
      if (foundDummy) {
        setTransaction(foundDummy);
      } else {
        // Ultimate fallback so the page never crashes if user enters a random ID
        const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const fallbackTx: Transaction = {
          id: invoiceId,
          date: dateStr,
          totalPrice: 899000,
          paymentType: "CREDIT CARD",
          items: [
            {
              id: 1,
              title: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
              price: 899000,
              originalPrice: 1299000
            }
          ],
          firstName: "Luthfi Alan",
          lastName: "Perdana",
          email: "luthfialan@bytestart.com"
        };
        setTransaction(fallbackTx);
      }
    }
  }, [invoiceId]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  if (!mounted || !transaction) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#892CDC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0314] min-h-screen text-white antialiased overflow-x-clip font-sans relative selection:bg-[#A156E3]/30 flex flex-col">
      
      {/* Background Decorative Glow (Print-Hidden) */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#52057B]/15 rounded-full blur-[150px] pointer-events-none z-0 select-none print-hidden" />

      {/* Dynamic @media print CSS styling */}
      <style>{`
        @media print {
          /* Hide Web Components */
          .print-hidden, 
          header, 
          footer, 
          .breadcrumb-nav {
            display: none !important;
          }
          
          /* Force white background & black text on print document */
          body, html, #__next, .printable-body-wrapper {
            background: white !important;
            color: black !important;
          }
          
          /* Set high contrast colors on invoice card container */
          .receipt-main-container {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .text-white {
            color: black !important;
          }
          
          .text-slate-400, .text-slate-300, .text-slate-500 {
            color: #374151 !important;
          }
          
          .bg-slate-900\\/40 {
            background-color: #f3f4f6 !important;
            color: black !important;
          }
          
          .border-slate-800, .border-slate-700, .border-white\\/5 {
            border-color: #d1d5db !important;
          }
          
          .font-poppins {
            font-family: inherit !important;
          }
        }
      `}</style>

      {/* GLOBAL NAVBAR (Print-Hidden) */}
      <div className="print-hidden">
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onShowToast={showToast}
        />
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow w-full">
        
        {/* Navigation Breadcrumb (Print-Hidden) */}
        <div className="mb-6 flex items-center justify-between print-hidden breadcrumb-nav">
          <Link 
            href="/dashboard/purchase-history"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#DDA5FF] transition-colors group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Purchase History</span>
          </Link>

          {/* Quick Print Action */}
          <button
            onClick={handlePrint}
            className="h-9 px-4 rounded-xl bg-[#892CDC] hover:bg-[#973fe8] active:scale-95 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer outline-none border-none text-white shadow-lg shadow-[#892CDC]/20"
          >
            <Printer className="size-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* PRINTABLE RECEIPT CARD BODY */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden receipt-main-container printable-body-wrapper">
          
          {/* Glowing element behind document (Print-Hidden) */}
          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#892CDC]/10 rounded-full blur-3xl pointer-events-none print-hidden" />

          {/* 1. Receipt Header Block */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white tracking-tight leading-none mb-2">
                Receipt
              </h1>
              <p className="text-xs text-slate-400 font-light">
                Receipt date: {transaction.date}
              </p>
            </div>
            
            {/* Logo brand */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[#FAEB92]" />
              <span className="font-poppins font-bold text-lg text-white uppercase tracking-wide">
                ByteStart
              </span>
            </div>
          </div>

          {/* 2. Customer & Company Meta Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-white/5 text-xs">
            
            {/* Company Info (Sold By) */}
            <div className="space-y-2 text-slate-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Sold By
              </span>
              <h4 className="font-bold text-white text-sm">ByteStart, Inc.</h4>
              <p className="font-light">Jl. Pendidikan Teknologi Raya No. 42</p>
              <p className="font-light">Yogyakarta, Indonesia</p>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); showToast("Membuka website resmi (Simulasi)", "info"); }}
                className="text-[#DDA5FF] hover:underline block font-medium print-hidden"
              >
                https://bytestart.com
              </a>
            </div>

            {/* Customer Info (Sold To) */}
            <div className="space-y-2 text-slate-300 sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Sold To
              </span>
              <h4 className="font-bold text-white text-sm">
                {transaction.firstName ? `${transaction.firstName} ${transaction.lastName}` : "Luthfi Alan Perdana"}
              </h4>
              
              {transaction.email && (
                <p className="font-light font-mono text-slate-400 break-all">
                  {transaction.email}
                </p>
              )}

              <div className="pt-2 space-y-0.5">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Order Details
                </p>
                <p className="font-mono text-slate-300 font-bold">
                  Order #: {transaction.id}
                </p>
                <p className="font-light text-slate-400">
                  Payment Method: <span className="font-semibold text-white">{transaction.paymentType}</span>
                </p>
              </div>
            </div>

          </div>

          {/* 3. Transaction Items Breakdown Table */}
          <div className="mt-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Transaction items details
            </span>
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="min-w-full overflow-x-auto">
                <table className="min-w-full text-xs text-left text-slate-300">
                  <thead className="bg-white/[0.02] border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Item</th>
                      <th className="px-4 py-3.5 text-center">Ordered</th>
                      <th className="px-4 py-3.5 text-center">Coupon Code</th>
                      <th className="px-4 py-3.5 text-center">Quantity</th>
                      <th className="px-4 py-3.5 text-right">Price</th>
                      <th className="px-5 py-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                    {transaction.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-5 py-4 font-semibold text-white max-w-[200px] md:max-w-[300px] truncate">
                          {item.title}
                        </td>
                        <td className="px-4 py-4 text-center text-slate-400 whitespace-nowrap">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {transaction.couponApplied ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                              {transaction.couponApplied}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-slate-300">
                          1
                        </td>
                        <td className="px-4 py-4 text-right font-medium">
                          {formatRupiah(item.price)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-white whitespace-nowrap">
                          {formatRupiah(item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Financial Calculations Summary Block */}
          <div className="mt-8 flex justify-end text-xs">
            <div className="w-full sm:w-72 space-y-2.5">
              
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Subtotal:</span>
                <span className="text-slate-200">{formatRupiah(financialDetails.subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  Tax (PPN 11%):
                </span>
                <span className="text-slate-200">{formatRupiah(financialDetails.tax)}</span>
              </div>

              <div className="border-t border-white/5 my-2.5 pt-3 flex justify-between items-baseline font-bold text-sm">
                <span className="text-white">Total Paid:</span>
                <span className="text-lg text-[#FAEB92] font-poppins">{formatRupiah(financialDetails.total)}</span>
              </div>

            </div>
          </div>

          {/* Quality check badge */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 font-light">
              <Lock className="size-3 text-slate-600" />
              <span>ByteStart Secure Billing • Verified Transaction</span>
            </div>
            <span className="font-light">
              If you have any questions, please contact our support team.
            </span>
          </div>

        </div>

      </main>

      {/* TOAST SYSTEM (Print-Hidden) */}
      <div className="print-hidden">
        <Toast toasts={toasts} onClose={handleCloseToast} />
      </div>

      {/* GLOBAL FOOTER (Print-Hidden) */}
      <div className="print-hidden">
        <Footer />
      </div>

    </div>
  );
}
