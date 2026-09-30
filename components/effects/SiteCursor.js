"use client";

import { useEffect, useState } from "react";
import SunCursor from "./SunCursor";

/** Site-wide Sun Breathing flame cursor — mouse/trackpad only, skipped for touch and reduced motion. */
export default function SiteCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return <SunCursor />;
}
