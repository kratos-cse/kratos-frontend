"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SunCursor from "./SunCursor";

const CURSOR_ROUTES = new Set(["/", "/about", "/kratos26-landing"]);

/** Flame cursor for marketing pages — fine pointer only, skipped for reduced motion. */
export default function SiteCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(motion.matches && pointer.matches);
    update();
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
    };
  }, []);

  if (!enabled || !CURSOR_ROUTES.has(pathname)) return null;

  return <SunCursor />;
}
