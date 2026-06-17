"use client";

import React from "react";
import { Globe, GraduationCap, Shield, Key, ChevronsUpDown } from "lucide-react";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const rolesConfig = [
  // { id: "public", name: "Calon Pelanggan", icon: Globe, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  // { id: "student", name: "Pelanggan", icon: GraduationCap, color: "text-[#DDA5FF] bg-[#A156E3]/10 border-[#A156E3]/20" },
  { id: "admin", name: "Admin", icon: Shield, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "owner", name: "Course Owner", icon: Key, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

export function SidebarRoleSwitcher() {
  const currentRole = usePreferencesStore((s) => s.currentRole);
  const setCurrentRole = usePreferencesStore((s) => s.setCurrentRole);
  const { isMobile, state } = useSidebar();

  const activeRole = rolesConfig.find((r) => r.id === currentRole) || rolesConfig[0];
  const ActiveIcon = activeRole.icon;
  const isCollapsed = state === "collapsed";

  const handleRoleChange = (roleId: string, roleName: string) => {
    setCurrentRole(roleId);
    
    // Dispatch event to update navbar/etc if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bytestart_role_updated", { detail: roleId }));
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-xl"
            >
              <div className={`flex size-8 items-center justify-center rounded-lg border ${activeRole.color} shrink-0`}>
                <ActiveIcon className="size-4" />
              </div>
              
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-xs leading-tight ml-2">
                    <span className="font-bold text-white text-[10px] uppercase tracking-wider text-slate-500">Active Role</span>
                    <span className="font-semibold text-slate-200 mt-0.5">{activeRole.name}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-500" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border border-white/[0.06] bg-slate-950/95 backdrop-blur-xl p-1.5 shadow-2xl z-[9999]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Switch Workspace Scope
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 my-1" />
            
            {rolesConfig.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = role.id === currentRole;
              return (
                <DropdownMenuItem
                  key={role.id}
                  onClick={() => handleRoleChange(role.id, role.name)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? "bg-amber-500/10 text-amber-300 font-bold" 
                      : "hover:bg-white/5 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className={`flex size-6 items-center justify-center rounded border ${role.color}`}>
                    <RoleIcon className="size-3.5" />
                  </div>
                  <span>{role.name}</span>
                  {isSelected && (
                    <span className="ml-auto size-1.5 rounded-full bg-amber-500" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
