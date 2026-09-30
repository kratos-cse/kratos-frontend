"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useUnstopTransition } from "./UnstopTransition";
import { useFloatSyncDelay } from "./LionJourney";
import styles from "./OrbitHero.module.css";

const HIT_RADIUS = 80;

export function OrbitHero({ arenas }) {
  const router = useRouter();
  const [unstopOverlay, goUnstop] = useUnstopTransition();
  const [stars, setStars] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [hot, setHot] = useState(null);
  const nodeRefs = useRef({});
  const floatDelay = useFloatSyncDelay();

  // Random positions are generated client-side only to avoid hydration mismatch.
  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        opacity: 0.2 + Math.random() * 0.6,
      }))
    );
  }, []);

  function nodeUnder(x, y) {
    let hit = null;
    for (const arena of arenas) {
      const el = nodeRefs.current[arena.key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + window.scrollX + r.width / 2;
      const cy = r.top + window.scrollY + r.height / 2;
      if (Math.hypot(x - cx, y - cy) < HIT_RADIUS) hit = arena;
    }
    return hit;
  }

  function goTo(arena) {
    if (arena.external) goUnstop(arena.href);
    else router.push(arena.href);
  }

  return (
    <section className={styles.hero}>
      <div className={styles.stars} aria-hidden>
        {stars.map((s, i) => (
          <span key={i} style={s} />
        ))}
      </div>
      <div className={styles.vignette} aria-hidden />

      <div className={styles.orbitWrap}>
        <div className={styles.ring} aria-hidden />
        <div className={`${styles.ring} ${styles.ringInner}`} aria-hidden />

        <div className={styles.lionZone}>
          {/* Lion 2: fixed in place. Lion 1 (LionJourney) scrolls straight down onto it. */}
          <span className={styles.lionGlow} aria-hidden />
          <div className={styles.lionSlot} data-lion-anchor="end">
            <motion.div
              drag
              dragSnapToOrigin
              onDragStart={() => setDragging(true)}
              onDrag={(e, info) => {
                setHot(nodeUnder(info.point.x, info.point.y)?.key ?? null);
              }}
              onDragEnd={(e, info) => {
                setDragging(false);
                setHot(null);
                const hit = nodeUnder(info.point.x, info.point.y);
                if (hit) goTo(hit);
              }}
              className={[styles.lion, dragging ? styles.lionDragging : ""].join(" ")}
              style={floatDelay ? { animationDelay: floatDelay } : { animation: "none" }}
              whileDrag={{ zIndex: 50 }}
            >
              <Image
                src="/landing/lion.png"
                alt="KRATOS'26 lion — drag it toward an arena"
                width={260}
                height={260}
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
              />
            </motion.div>
          </div>
          <p className={styles.eyebrow}>FIVE REALMS. ONE LEGEND.</p>
          <p className={styles.subtext}>Tap an arena or drag the lion toward it.</p>
          <h1 className={styles.headline}>
            Choose your
            <br />
            arena.
          </h1>
        </div>

        <div className={styles.nodeGrid}>
          {arenas.map((arena) => (
            <button
              key={arena.key}
              type="button"
              ref={(el) => {
                nodeRefs.current[arena.key] = el;
              }}
              className={[styles.node, styles[`n_${arena.key}`], hot === arena.key ? styles.hot : ""].join(" ")}
              onClick={() => goTo(arena)}
              aria-label={arena.external ? `${arena.title} — register on Unstop` : `${arena.title} events`}
            >
              <span className={styles.iconWrap}>
                <Image src={arena.icon} alt="" width={120} height={112} />
              </span>
              <span className={styles.meta}>
                {arena.num} / {arena.verb.toUpperCase()}
              </span>
              <span className={styles.label}>{arena.title.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {unstopOverlay}
    </section>
  );
}
