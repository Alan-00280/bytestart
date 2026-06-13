"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") { console.log('typeof window === "undefined"'); return; };
    // console.log('typeof window !== "undefined"')

    let targetScrollY = window.scrollY;
    let isMoving = false;
    const speed = 120; // Scroll step speed
    const factor = 0.08; // Smoothness factor (lower = smoother)

    const handleWheel = (e: WheelEvent) => {
      // Find scrollable parents of target to avoid hijacking scroll inside scrollable sidebars/containers
      const path = e.composedPath() as HTMLElement[];
      for (const element of path) {
        if (element && element.scrollHeight > element.clientHeight) {
          const overflowY = window.getComputedStyle(element).overflowY;
          if (
            element !== document.body && 
            element !== document.documentElement && 
            (overflowY === "auto" || overflowY === "scroll")
          ) {
            return; // Let standard nested element scroll happen
          }
        }
      }

      // Trackpads fire many small, fractional scroll events.
      // Physical mouse wheels scroll in rigid steps (typically multiples of 100 or 120).
      // We skip hijacking if the scroll is fractional (likely a trackpad).
      const isTrackpad = Math.abs(e.deltaY) < 40 || !Number.isInteger(e.deltaY);
      if (isTrackpad) return;

      e.preventDefault();

      const direction = e.deltaY > 0 ? 1 : -1;
      targetScrollY += direction * speed;

      // Clamp target scroll
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

      if (!isMoving) {
        isMoving = true;
        animateScroll();
      }
    };

    const animateScroll = () => {
      if (!isMoving) return;

      const diff = targetScrollY - window.scrollY;
      
      if (Math.abs(diff) > 0.5) {
        window.scrollTo(0, window.scrollY + diff * factor);
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, targetScrollY);
        isMoving = false;
      }
    };

    // Update targetScrollY if scrolled via scrollbar, page keys, etc.
    const handleScroll = () => {
      if (!isMoving) {
        targetScrollY = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
