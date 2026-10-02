"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import styles from "./LionJourney.module.css";

/**
 * TWO lions, one journey.
 *  - Lion 2 lives in the "Choose your arena" section (OrbitHero). It never moves and is the
 *    interactive (draggable) one.
 *  - Lion 1 (this overlay) starts in the hero slot (data-lion-anchor="start") and, driven
 *    purely by scroll, travels STRAIGHT DOWN — behind the hero content — until it exactly
 *    overlaps Lion 2's slot (data-lion-anchor="end"). There it hands over: Lion 2 fades in on
 *    top of it, then Lion 1 fades out underneath. Scrolling up runs it in reverse.
 *
 * X never changes (no translateX, no curve, no diagonal). Only Y, a size-match scale and
 * opacity (receding behind the hero content, then the handoff) are animated.
 *
 * Scroll interval (all measured from the two anchors, nothing hardcoded):
 *   0 ........ land ........ done ... end
 *   | travelling | handoff     |
 *   end  = scroll at which Lion 2's slot is mid-viewport (or the arena scene is framed)
 *   land = Lion 1 is parked on Lion 2's slot (from here it scrolls with the page)
 *   done = Lion 1 is gone, Lion 2 is the only (and now interactive) lion
 */

// Fractions of the 0 → end interval.
const TRAVEL_END = 0.8;
const HANDOFF_END = 0.95;
// Lion 2's slot must be at least this far inside the viewport when Lion 1 lands on it.
const LAND_MARGIN = 16;
// While Lion 1 is behind the hero content (logo, description, CTAs) it recedes to this
// opacity so the content stays clean and readable; it is back to full once it clears them.
const BEHIND_CONTENT_OPACITY = 0.3;
// Arena lion's CSS float cycle (OrbitHero.module.css `float`), used to keep both lions in phase.
const FLOAT_MS = 6000;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const clamp01 = (n) => clamp(n, 0, 1);
const smooth = (t) => t * t * (3 - 2 * t);

// Before the first measurement (and on the server): Lion 1 hidden, Lion 2 fully usable.
const UNMEASURED = { x: 0, y: 0, scale: 1, travel: 0, lion1: 0, lion2: 1, handedOver: true };

const LionArrivalContext = createContext(null);

/**
 * For the arena lion (Lion 2): motion values for its handoff `opacity` and `pointerEvents`.
 * Null outside a LionJourney, where Lion 2 is simply always visible and interactive.
 */
export function useLionArrival() {
  return useContext(LionArrivalContext);
}

/**
 * Float animations on both lions share one global clock: a CSS animation started with
 * delay = -(now mod cycle) always sits at phase (now mod cycle). Returns null until mounted
 * (keeps SSR/hydration identical), then a delay string.
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
  const floatDelay = useFloatSyncDelay();
  const reducedMotion = useReducedMotion();

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
    const vh = window.innerHeight;
    const w = wrap.getBoundingClientRect();
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const scene = (b.closest("section") ?? b).getBoundingClientRect();

    const size = ra.width || 240;
    // The hero content Lion 1 passes behind: everything below its slot in the slot's block.
    const content = (a.parentElement ?? a).getBoundingClientRect();
    const by = rb.top + sy + rb.height / 2;

    // END: Lion 2's slot reaches the middle of the viewport, or the arena scene is framed (top
    // edge at the viewport top / centred when shorter than the viewport) — whichever comes
    // first. Never past what the page can actually scroll to.
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const slotCentred = by - vh / 2;
    const sceneFramed = scene.top + sy - Math.max(0, (vh - scene.height) / 2);
    const end = clamp(Math.min(slotCentred, sceneFramed), 1, maxScroll);

    // LAND: normally TRAVEL_END of the way there, but never before Lion 2's slot has fully
    // entered the viewport (short viewports), so the landing is always on screen.
    const slotInView = by + rb.height / 2 + LAND_MARGIN - vh;
    const land = clamp(slotInView, end * TRAVEL_END, end * HANDOFF_END);
    const done = Math.max(end * HANDOFF_END, (land + end) / 2);

    geo.set({
      size,
      // lion centres in document space
      ax: ra.left + sx + ra.width / 2,
      ay: ra.top + sy + ra.height / 2,
      by,
      endScale: rb.width / size,
      contentTop: ra.bottom + sy,
      contentBottom: content.bottom + sy,
      wrapX: w.left + sx,
      wrapY: w.top + sy,
      land,
      done,
      still: !!reducedMotion,
    });
  }, [geo, reducedMotion]);

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.addEventListener("load", measure);
    // The wrapper catches any height change of either hero; the anchors catch breakpoint
    // changes that resize a slot without changing the overall height.
    const ro = new ResizeObserver(measure);
    if (wrap) {
      ro.observe(wrap);
      wrap.querySelectorAll("[data-lion-anchor]").forEach((el) => ro.observe(el));
    }
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("load", measure);
      ro.disconnect();
    };
  }, [measure]);

  // Everything about the journey at the current scroll position.
  const journey = useTransform([scrollY, geo], ([s, g]) => {
    if (!g) return UNMEASURED;
    const half = g.size / 2;
    const x = g.ax - g.wrapX - half; // constant: both slots share one vertical centre line

    // Reduced motion: no journey. Lion 1 simply stays in its hero slot, Lion 2 in the arena.
    if (g.still) {
      return { x, y: g.ay - g.wrapY - half, scale: 1, travel: 0, lion1: 1, lion2: 1, handedOver: true };
    }

    const t = clamp01(s / g.land);
    const e = smooth(t);

    // Vertical position in the VIEWPORT: start slot → end slot (as it sits at s = land)
    const vy = g.ay + (g.by - g.land - g.ay) * e;
    // Convert to document space (adds scroll while travelling; once landed, Lion 1 is
    // parked exactly on Lion 2's slot and scrolls natively with the page).
    const docY = t < 1 ? vy + s : g.by;

    // Size-match only (about the lion's own centre, so it cannot shift X): the two
    // slots differ slightly in size, this makes the final overlap pixel-exact.
    const scale = 1 + (g.endScale - 1) * e;

    // Handoff, only once the two lions coincide: Lion 2 fades in over a still-opaque Lion 1,
    // then Lion 1 fades out beneath an opaque Lion 2 — the silhouette never dims or doubles.
    const h = clamp01((s - g.land) / (g.done - g.land));
    const lion2 = smooth(clamp01(h * 2));
    const fadeOut = 1 - smooth(clamp01(h * 2 - 1));

    // Recede while behind the hero content: fully dimmed once half the lion is behind it.
    const top = docY - half * scale;
    const bottom = docY + half * scale;
    const covered = Math.max(0, Math.min(bottom, g.contentBottom) - Math.max(top, g.contentTop));
    const behind = smooth(clamp01(covered / (half * scale)));
    const lion1 = fadeOut * (1 - (1 - BEHIND_CONTENT_OPACITY) * behind);

    return { x, y: docY - g.wrapY - half, scale, travel: e, lion1, lion2, handedOver: h === 1 };
  });

  const transform = useTransform(
    journey,
    (v) => `translate3d(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px, 0) scale(${v.scale.toFixed(4)})`
  );
  const opacity = useTransform(journey, (v) => v.lion1);
  const travel = useTransform(journey, (v) => v.travel);

  // Same drop-shadow as each section's lion, eased from screen 1's to screen 2's.
  const filter = useTransform(
    travel,
    [0, 1],
    [
      "drop-shadow(0 0 30px rgba(230, 60, 40, 0.4)) drop-shadow(0 0 60px rgba(230, 150, 40, 0))",
      "drop-shadow(0 0 30px rgba(210, 60, 40, 0.55)) drop-shadow(0 0 60px rgba(230, 150, 40, 0.18))",
    ]
  );

  // Lion 1 is still in the hero and eases into Lion 2's float (same clock, same on-screen
  // amplitude) as it travels, so it is already bobbing in phase when the two overlap.
  const floatAmount = useTransform(journey, (v) => (v.travel / v.scale).toFixed(4));

  const lion2Opacity = useTransform(journey, (v) => v.lion2);
  // Lion 2 only takes input once Lion 1 is gone (nothing left underneath to drag away from).
  const lion2PointerEvents = useTransform(journey, (v) => (v.handedOver ? "auto" : "none"));
  const arrival = useMemo(
    () => ({ opacity: lion2Opacity, pointerEvents: lion2PointerEvents }),
    [lion2Opacity, lion2PointerEvents]
  );

  return (
    <LionArrivalContext.Provider value={arrival}>
      <div ref={wrapRef} className={styles.wrap}>
        {children}
        <motion.div
          className={styles.lion}
          style={{ transform, filter, opacity, "--lion-float": floatAmount }}
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
    </LionArrivalContext.Provider>
  );
}
