"use client";

import { useRef } from "react";

export default function TiltLion() {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((e.clientX - rect.left - cx) / cx) * 24;
    const rotateX = -((e.clientY - rect.top - cy) / cy) * 24;
    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
  }

  function handleLeave() {
    if (ref.current) ref.current.style.transform = "rotateX(0) rotateY(0) scale(1)";
  }

  return (
    <div className="lion-tilt-wrap">
      <div
        ref={ref}
        className="lion-tilt"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <img src="/lion-logo.png" alt="Kratos Lion" draggable={false} />
      </div>
    </div>
  );
}
