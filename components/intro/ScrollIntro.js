"use client";

import { useEffect, useRef, useState } from "react";
import { Overlay } from "./Overlay";
import { Scene3D } from "./Scene3D";
import { useScrollProgress } from "./useScrollProgress";

const HANDOFF_AT = 0.94;
const FLY_MS = 480;
const CROSSFADE_MS = 320;
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const LION_SRC = "/assets/img/lion.png";

function fallbackLionRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const h = Math.min(Math.max(vw * 0.23, 190), 280);
  const w = h * 0.92;
  return { left: (vw - w) / 2, top: vh * 0.18, width: w, height: h };
}

function flyLionToLanding({ fromRect, reduceMotion }) {
  return new Promise((resolve) => {
    const target = document.getElementById("landing-lion");
    if (!target) {
      resolve();
      return;
    }

    void target.offsetWidth;
    const to = target.getBoundingClientRect();
    const from = fromRect?.width > 1 ? fromRect : fallbackLionRect();

    if (reduceMotion) {
      resolve();
      return;
    }

    const bridge = document.createElement("img");
    bridge.src = LION_SRC;
    bridge.alt = "";
    bridge.className = "intro-lion-bridge";
    bridge.style.cssText = [
      "position:fixed",
      `left:${from.left}px`,
      `top:${from.top}px`,
      `width:${from.width}px`,
      `height:${from.height}px`,
      "object-fit:contain",
      "z-index:120",
      "pointer-events:none",
      "filter:drop-shadow(0 0 32px rgba(255,90,20,.55)) drop-shadow(0 16px 28px rgba(0,0,0,.45))",
      "will-change:transform",
      "margin:0",
      "padding:0",
    ].join(";");
    document.body.appendChild(bridge);

    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const sx = to.width / Math.max(from.width, 1);
    const sy = to.height / Math.max(from.height, 1);

    const anim = bridge.animate(
      [
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})` },
      ],
      { duration: FLY_MS, easing: EASE_OUT, fill: "forwards" },
    );

    const finish = () => {
      bridge.remove();
      resolve();
    };
    anim.onfinish = finish;
    anim.oncancel = finish;
  });
}

export default function ScrollIntro({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [scrollEl, setScrollEl] = useState(null);
  const doneRef = useRef(false);
  const { target, value } = useScrollProgress(scrollEl);
  const progress = useRef(0);
  const lionScreenRef = useRef(null);

  async function dismiss() {
    if (doneRef.current) return;
    doneRef.current = true;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fromRect = lionScreenRef.current?.width > 1 ? { ...lionScreenRef.current } : null;

    // Crossfade stage + shared-element lion. Document scroll never moves.
    setDone(true);

    await flyLionToLanding({ fromRect, reduceMotion: reduce });

    onDone && onDone();

    setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("kratos-stage");
      document.documentElement.classList.remove("intro-doc-lock");
      document.body.classList.remove("intro-doc-lock");
    }, CROSSFADE_MS);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.add("intro-doc-lock");
    document.body.classList.add("intro-doc-lock");
    document.body.classList.add("kratos-stage");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dismiss();
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-6 * dt);
      value.current += (target.current - value.current) * k;
      progress.current = value.current;
      if (!doneRef.current && progress.current >= HANDOFF_AT) {
        dismiss();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("kratos-stage");
      document.documentElement.classList.remove("intro-doc-lock");
      document.body.classList.remove("intro-doc-lock");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, value]);

  if (!visible) return null;

  return (
    <div
      id="intro-overlay"
      ref={setScrollEl}
      role="dialog"
      aria-label="Kratos'26 scroll intro"
      className={done ? "done scroll-intro" : "scroll-intro"}
    >
      <div className="intro-stage">
        <div className="intro-backdrop" aria-hidden="true" />
        <div className="intro-vignette" aria-hidden="true" />
        <Overlay progress={progress} />
        <div className="intro-canvas">
          <Scene3D progress={progress} lionScreenRef={lionScreenRef} />
        </div>
        <div className="intro-controls">
          <span className="intro-progress-label" aria-hidden="true">
            Scroll the arena
          </span>
          <button className="intro-skip" type="button" onClick={dismiss} autoFocus>
            Skip intro
          </button>
        </div>
      </div>

      <div className="intro-runway" aria-hidden="true" />
    </div>
  );
}
