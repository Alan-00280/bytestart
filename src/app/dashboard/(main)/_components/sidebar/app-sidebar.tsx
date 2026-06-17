"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import { CircleHelp, ClipboardList, Command, Database, File, Search, Settings, GraduationCap, LayoutDashboard, BookOpen } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";
import { SidebarRoleSwitcher } from "./sidebar-role-switcher";

const _data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced, currentRole } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
      currentRole: s.currentRole,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const filteredSidebarItems = useMemo(() => {
    if (currentRole !== "owner") {
      return sidebarItems.map((group) => {
        if (group.id === 1) {
          const filtered = group.items.filter((item) =>
            ["Analytics"].includes(item.title)
          );
          return {
            ...group,
            label: "Course Owner Portal",
            items: [
              {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
              },
              ...filtered,
            ],
          };
        }
        if (group.id === 2) {
          const filtered = group.items.filter((item) =>
            ["Email", "Chat", "Calendar", "Users", "Roles", "Authentication"].includes(item.title)
          )
          // Pages group: Hanya tampilkan Email, Chat, Kanban, dan Users
          return {
            ...group,
            items: [
              ...filtered
            ]
          };
        }
        // Sembunyikan grup Legacy dan Misc untuk peran owner
        if (group.id === 3 || group.id === 4) {
          return null;
        }
        return group;
      })
      .filter((group): group is Exclude<typeof group, null> => group !== null);
    }

    return sidebarItems
      .map((group) => {
        if (group.id === 1) {
          // Dashboards group: Hanya tampilkan Academy, Analytics, Finance, dan Productivity, tambah My Course
          const filtered = group.items.filter((item) =>
            ["Analytics", "Productivity"].includes(item.title)
          );
          return {
            ...group,
            label: "Course Owner Portal",
            items: [
              {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
              },
              {
                title: "My Course",
                url: "/dashboard/my-courses",
                icon: GraduationCap,
              },
              {
                title: "My Article",
                url: "/dashboard/my-articles",
                icon: BookOpen,
              },
              // ...filtered,
            ],
          };
        }
        if (group.id === 2) {
          const filtered = group.items.filter((item) =>
            ["Email", "Chat"].includes(item.title)
          )
          // Pages group: Hanya tampilkan Email, Chat, Kanban, dan Users
          return {
            ...group,
            items: [
              ...filtered,
              {
                title: "Students",
                url: "/dashboard/my-students",
                icon: GraduationCap,
              }
            ]
          };
        }
        // Sembunyikan grup Legacy dan Misc untuk peran owner
        if (group.id === 3 || group.id === 4) {
          return null;
        }
        return group;
      })
      .filter((group): group is Exclude<typeof group, null> => group !== null);
  }, [currentRole]);

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/courses">
                <img 
                  src="/icons/png/icon-dark.png" 
                  alt="ByteStart" 
                  className="size-6 dark:block hidden"
                />
                <img 
                  src="/icons/png/icon-light.png" 
                  alt="ByteStart" 
                  className="size-6 dark:hidden block"
                />
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredSidebarItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarRoleSwitcher />
        <SidebarSupportCard />
        <NavUser user={rootUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
