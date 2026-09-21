"use client";

import { useEffect, useRef } from "react";

/**
 * Shared, smoothed scroll progress (0..1) from a scroll root element.
 * Pass the overlay scroller element (not window) so document scroll stays at 0.
 */
export function useScrollProgress(scrollEl) {
  const target = useRef(0);
  const value = useRef(0);

  useEffect(() => {
    if (!scrollEl) return;

    const read = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      target.current = max > 0 ? scrollEl.scrollTop / max : 0;
    };

    read();
    scrollEl.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      scrollEl.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [scrollEl]);

  return { target, value };
}
