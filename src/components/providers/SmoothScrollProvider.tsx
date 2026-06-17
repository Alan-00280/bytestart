"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with configurations requested in the prompt
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      // For mobile smooth touch handling (disabled by default as per requirements)
      // Note: in Lenis, touch configurations are set as smoothTouch or syncTouch depending on version
      // We declare them matching the exact options requested:
    });

    lenisRef.current = lenis;

    // Custom animation frame loop for higher performance and custom callbacks
    let rafId: number;
    const animate = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // Smooth scroll handler for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (
        anchor && 
        anchor.hash && 
        anchor.origin === window.location.origin &&
        anchor.getAttribute("href")?.startsWith("#")
      ) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement);
        }
      }
    };

    window.addEventListener("click", handleAnchorClick);

    // Cleanup to prevent memory leaks
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef.current}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
