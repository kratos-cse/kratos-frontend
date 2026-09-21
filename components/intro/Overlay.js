"use client";

import { useEffect, useRef } from "react";
import { clamp01, easeInOut, easeOut, pulse, seg } from "./progress";
import styles from "./intro.module.css";

const ACT_LIST = [
  {
    key: "technical",
    label: "01 / Technical Events",
    word: "TECHNICAL",
    sub: "Paper Wars · Circuit Sprint · Code Forge",
    window: [0.14, 0.33],
    drift: -1,
  },
  {
    key: "spark",
    label: "02 / Spark Events",
    word: "SPARK",
    sub: "Ideathon · Pitch Arena · Innovation Lab",
    window: [0.31, 0.5],
    drift: 1,
  },
  {
    key: "online",
    label: "03 / Online Events",
    word: "ONLINE",
    sub: "Remote Quiz · Digital Design · Cloud Clash",
    window: [0.46, 0.64],
    drift: -1,
  },
  {
    key: "playground",
    label: "04 / Playground Events",
    word: "PLAYGROUND",
    sub: "Esports Arena · Free Fire · Turf Tactics",
    window: [0.6, 0.77],
    drift: 1,
  },
  {
    key: "hackathon",
    label: "05 / Hackathon",
    word: "HACKATHON",
    sub: "24 Hours · Build · Break · Dominate",
    window: [0.73, 0.89],
    drift: -1,
  },
];

/** Kinetic type + scroll hint only — no 3D-repo end hero. */
export function Overlay({ progress }) {
  const actRefs = useRef([]);
  const openRef = useRef(null);
  const hintRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progress.current;

      if (openRef.current) {
        const o = 1 - easeInOut(clamp01(seg(p, 0.02, 0.12)));
        openRef.current.style.opacity = String(easeOut(clamp01(p / 0.02)) * o);
        openRef.current.style.transform = `translate3d(0, ${(1 - o) * -40}px, 0) scale(${1 + (1 - o) * 0.12})`;
      }

      ACT_LIST.forEach((act, i) => {
        const el = actRefs.current[i];
        if (!el) return;
        const t = seg(p, act.window[0], act.window[1]);
        // Soft pre-handoff: kinetic type gone before the lion settles into hero.
        const preHandoff = clamp01(seg(p, 0.84, 0.9));
        const live = t > 0.001 && t < 0.999 && preHandoff < 1;
        el.style.visibility = live ? "visible" : "hidden";
        if (!live) return;
        const o = pulse(t, 0.18, 0.7) * (1 - preHandoff);
        const x = (0.5 - t) * 62 * act.drift;
        el.style.opacity = String(o);
        el.style.transform = `translate3d(${x}vw, ${(0.5 - t) * -6}vh, 0) rotate(${(0.5 - t) * 2.2 * act.drift}deg) scale(${0.88 + o * 0.16})`;
      });

      if (hintRef.current) {
        // Hide hint once scrolling starts; stay gone through the handoff.
        hintRef.current.style.opacity = String(1 - clamp01(p / 0.05));
      }
      if (flashRef.current) {
        const beats = [0.14, 0.31, 0.46, 0.6, 0.73, 0.86];
        let f = 0;
        for (const b of beats) f = Math.max(f, 1 - Math.min(1, Math.abs(p - b) / 0.012));
        flashRef.current.style.opacity = String(f * 0.35);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <>
      <div className={styles.kinetic}>
        <div ref={openRef} className={styles.openLine}>
          <p className={styles.openEyebrow}>Easwari Engineering College presents</p>
          <p className={styles.openTitle}>THE BEAST AWAKENS</p>
        </div>

        {ACT_LIST.map((act, i) => (
          <div
            key={act.key}
            ref={(el) => {
              actRefs.current[i] = el;
            }}
            className={styles.act}
            style={{ visibility: "hidden", opacity: 0 }}
          >
            <span className={styles.actLabel}>{act.label}</span>
            <h2 className={styles.actWord}>{act.word}</h2>
            <span className={styles.actSub}>{act.sub}</span>
          </div>
        ))}
      </div>

      <div className={styles.foreground}>
        <div ref={hintRef} className={styles.hint}>
          <span>Scroll to begin</span>
          <span className={styles.scrollLine} />
        </div>
        <div ref={flashRef} className={styles.flash} />
      </div>
    </>
  );
}
