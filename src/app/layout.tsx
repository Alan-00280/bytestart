import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Import Konfigurasi & Provider dari Template Dashboard
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { ThemeBootScript } from "@/scripts/theme-boot";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

import "./globals.css";

// Konfigurasi Font Google bawaan ByteStart
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ByteStart Platform",
  description: "High-Performance Learning Dashboard",
  icons: {
    icon: [
      {
        url: "/icons/ico/icon-light.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/ico/icon-dark.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil nilai bawaan dari preferences-config untuk rendering sisi server (SSR)
  const {
    theme_mode,
    theme_preset,
    content_layout,
    navbar_style,
    sidebar_variant,
    sidebar_collapsible,
    font,
  } = PREFERENCE_DEFAULTS;

  // Baca role dari cookie di server
  const cookieStore = await cookies();
  const currentRole = cookieStore.get("bytestart_role")?.value || "public";

  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, poppins.variable)}
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      data-role={currentRole}
      suppressHydrationWarning // Wajib ada agar Next.js tidak melempar error saat tema dimodifikasi script boot
    >
      <head>
        {/* Mengeksekusi script boot tema instan sebelum UI React selesai dimuat */}
        <ThemeBootScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <TooltipProvider>
          {/* Bungkus State Preferences di layer atas untuk melayani komponen Dashboard global */}
          <PreferencesStoreProvider
            themeMode={theme_mode}
            themePreset={theme_preset}
            contentLayout={content_layout}
            navbarStyle={navbar_style}
            font={font}
            currentRole={currentRole}
          >
            {/* Smooth Scroll Provider milik ByteStart */}
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
            
            {/* Komponen Notifikasi Toast global */}
            <Toaster />
          </PreferencesStoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}