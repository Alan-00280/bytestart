"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import { Shield, Key, Layers, Users, DollarSign } from "lucide-react";
import { coursesData } from "@/data/coursesMock";
import { formatCurrency } from "@/lib/utils";

import { CardOverview } from "./_components/card-overview";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { IncomeReliability } from "./_components/income-reliability";
import { MonthlyCashFlow } from "./_components/kpis/monthly-cash-flow";
import { NetWorth } from "./_components/kpis/net-worth";
import { PrimaryAccount } from "./_components/kpis/primary-account";
import { SavingsRate } from "./_components/kpis/savings-rate";
import { SpendingBreakdown } from "./_components/spending-breakdown";

export default function Page() {
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);

  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [estimatedRev, setEstimatedRev] = useState(0);

  useEffect(() => {
    if (currentRole === "owner") {
      const saved = localStorage.getItem("bytestart_owner_courses");
      let list = coursesData.filter(c => c.ownerId === "owner-1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Normalize old courses by adding ownerId from coursesMock if missing
            const normalized = parsed.map((c: any) => {
              if (!c.ownerId) {
                const original = coursesData.find(o => o.id === c.id);
                return { ...c, ownerId: original ? original.ownerId : "owner-1" };
              }
              return c;
            });
            
            // Save normalized courses back to localStorage to heal the store
            localStorage.setItem("bytestart_owner_courses", JSON.stringify(normalized));
            
            list = normalized.filter((c: any) => c.ownerId === "owner-1");
          }
        } catch (e) {}
      }
      setCoursesCount(list.length);
      setStudentsCount(list.reduce((acc, c) => acc + (c.reviewsCount * 12), 0));
      setEstimatedRev(list.reduce((acc, c) => acc + (c.price * c.reviewsCount * 6), 0));
    }
  }, [currentRole]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic Header with Role Access Control */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-poppins text-foreground flex items-center gap-2">
            System Control Panel
            <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize text-primary">
              Role: {currentRole}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle user roles dynamically to inspect specific views and workspace scopes (Admin Portal / Course Owner Portal).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={currentRole === "admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentRole("admin")}
            className="gap-1.5 transition-all shrink-0"
          >
            <Shield className="size-4" />
            <span>Admin</span>
          </Button>

          <Button
            variant={currentRole === "owner" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentRole("owner")}
            className="gap-1.5 transition-all shrink-0"
          >
            <Key className="size-4" />
            <span>Owner</span>
          </Button>
        </div>
      </div>

      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activity
          </TabsTrigger>
          <TabsTrigger disabled value="insights">
            Insights
          </TabsTrigger>
          <TabsTrigger disabled value="utilities">
            Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-xs">
            {/* Owner Stats Overview Header */}
            {currentRole === "owner" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
                <div className="relative overflow-hidden rounded-2xl border bg-card p-5 text-card-foreground shadow-xs flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Courses</span>
                    <span className="text-2xl font-black text-foreground font-poppins">{coursesCount}</span>
                  </div>
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <Layers className="size-5" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border bg-card p-5 text-card-foreground shadow-xs flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Enrolled Students</span>
                    <span className="text-2xl font-black text-foreground font-poppins">{studentsCount}</span>
                  </div>
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                    <Users className="size-5" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border bg-card p-5 text-card-foreground shadow-xs flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Estimated Revenue</span>
                    <span className="text-2xl font-black text-[#FAEB92] font-poppins">{formatCurrency(estimatedRev / 15000, { noDecimals: true })}</span>
                  </div>
                  <div className="p-2.5 bg-[#FAEB92]/10 rounded-xl border border-[#FAEB92]/20 text-[#FAEB92]">
                    <DollarSign className="size-5" />
                  </div>
                </div>
              </div>
            )}

            {currentRole === "admin" && (
            <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:gap-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              <PrimaryAccount />
              <NetWorth />
              <MonthlyCashFlow />
              <SavingsRate />
            </div>
            )}

            <div className={`grid grid-cols-1 gap-4 ${currentRole === "owner" ? "" : "lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"}`}>
              <div className="flex flex-col gap-4">
                <CashFlowOverview />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <SpendingBreakdown />
                  <IncomeReliability />
                </div>
              </div>

              {currentRole !== "owner" && <CardOverview />}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
