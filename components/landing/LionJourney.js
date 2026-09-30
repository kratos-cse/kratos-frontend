"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import styles from "./LionJourney.module.css";

/**
 * TWO lions.
 *  - Lion 2 lives in the "Choose your arena" section (OrbitHero). It never moves.
 *  - Lion 1 (this overlay) starts in the hero slot (data-lion-anchor="start") and,
 *    driven purely by scroll, travels STRAIGHT DOWN until it exactly overlaps
 *    Lion 2 (data-lion-anchor="end"). Scrolling up runs it in reverse.
 *
 * X never changes (no translateX, no curve, no diagonal). Only Y is animated.
 */

// Lion 1 finishes settling at this fraction of the distance to screen 2, so it
// rests on Lion 2 a moment before the page finishes scrolling.
const END_RATIO = 0.9;
// Arena lion's CSS float cycle (OrbitHero.module.css `float`), used to keep both lions in phase.
const FLOAT_MS = 6000;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * Float animations on both lions share one global clock: a CSS animation started with
 * delay = -(now mod cycle) always sits at phase (now mod cycle). Returns null until mounted
 * (keeps SSR/hydration identical), then a delay string. Used by the arena lion.
 */
export function useFloatSyncDelay() {
  const [delay, setDelay] = useState(null);
  useEffect(() => {
    setDelay(`-${Math.round(document.timeline.currentTime % FLOAT_MS)}ms`);
  }, []);
  return delay;
}

export function LionJourney({ children }) {
  const wrapRef = useRef(null);
  const [floatDelay, setFloatDelay] = useState(null);
  const [ready, setReady] = useState(false);

  const { scrollY } = useScroll();
  const geo = useMotionValue(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const a = wrap.querySelector('[data-lion-anchor="start"]');
    const b = wrap.querySelector('[data-lion-anchor="end"]');
    if (!a || !b) return;
    const sy = window.scrollY;
    const sx = window.scrollX;
    const w = wrap.getBoundingClientRect();
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const hero2 = b.closest("section");
    const hero2Top = (hero2 ? hero2.getBoundingClientRect().top : rb.top) + sy;

    const wrapX = w.left + sx;
    const wrapY = w.top + sy;
    const size = ra.width || 240;

    geo.set({
      size,
      // lion centre in document space
      ax: ra.left + sx + ra.width / 2,
      ay: ra.top + sy + ra.height / 2,
      bx: rb.left + sx + rb.width / 2,
      by: rb.top + sy + rb.height / 2,
      endScale: rb.width / size,
      wrapX,
      wrapY,
      end: Math.max(1, hero2Top * END_RATIO),
      vh: window.innerHeight,
    });
    setReady(true);
  }, [geo]);

  useIsoLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [measure]);

  // 0 → 1 scroll progress of the journey
  const progress = useTransform([scrollY, geo], ([s, g]) => (g ? clamp01(s / g.end) : 0));

  // Pose of Lion 1. X is a constant (Lion 1 and Lion 2 share the same vertical centre line);
  // only Y changes with scroll.
  const pose = useTransform([scrollY, geo], ([s, g]) => {
    if (!g) return { x: 0, y: 0, scale: 1 };
    const p = clamp01(s / g.end);
    const e = smooth(p);

    // Vertical position in the VIEWPORT: start slot → end slot (as it sits at s = end)
    const vy = g.ay + (g.by - g.end - g.ay) * e;
    // Convert to document space (adds scroll while travelling; once landed, Lion 1 is
    // parked exactly on Lion 2 and scrolls natively with the page).
    const docY = p < 1 ? vy + s : g.by;

    // Size-match only (about the lion's own centre, so it cannot shift X): the two
    // slots differ slightly in size, this makes the final overlap pixel-exact.
    const scale = 1 + (g.endScale - 1) * e;
    const half = g.size / 2;
    return { x: g.ax - g.wrapX - half, y: docY - g.wrapY - half, scale };
  });

  const transform = useTransform(
    pose,
    (v) => `translate3d(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px, 0) scale(${v.scale.toFixed(4)})`
  );

  // Same drop-shadow as each section's lion, eased from screen 1's to screen 2's.
  const filter = useTransform(
    progress,
    [0, 1],
    [
      "drop-shadow(0 0 30px rgba(230, 60, 40, 0.4)) drop-shadow(0 0 60px rgba(230, 150, 40, 0))",
      "drop-shadow(0 0 30px rgba(210, 60, 40, 0.55)) drop-shadow(0 0 60px rgba(230, 150, 40, 0.18))",
    ]
  );

  // Once Lion 1 is parked on Lion 2 it adopts Lion 2's float, in phase, so they stay merged.
  useMotionValueEvent(progress, "change", (p) => {
    const landed = p >= 0.999;
    setFloatDelay((d) => {
      if (!landed) return d === null ? d : null;
      return d ?? `-${Math.round(document.timeline.currentTime % FLOAT_MS)}ms`;
    });
  });

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {children}
      <motion.div
        className={styles.lion}
        style={{ transform, filter, opacity: ready ? 1 : 0 }}
        aria-hidden
      >
        <Image
          src="/landing/lion.png"
          alt=""
          width={260}
          height={260}
          priority
          draggable={false}
          className={[styles.img, floatDelay ? styles.float : ""].join(" ")}
          style={floatDelay ? { animationDelay: floatDelay } : undefined}
        />
      </motion.div>
    </div>
  );
}
