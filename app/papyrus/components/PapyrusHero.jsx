"use client";

import { useRef } from "react";
import { DarkVeil } from "@/components/motion/DarkVeil";
import styles from "../papyrus.module.css";

export default function PapyrusHero({ taglineLines, heroDate, heroTime, heroVenue }) {
  const heroSectionRef = useRef(null);

  return (
    <section ref={heroSectionRef} id="hero" className={styles.heroSection}>
      <div className={styles.heroBackground} aria-hidden="true">
        <DarkVeil
          observeRootRef={heroSectionRef}
          colorStops={["#1a0812", "#2a1848", "#0e1e42"]}
          amplitude={1.45}
          blend={0.72}
          speed={0.85}
          lightMode={false}
        />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>PAPYRUS</h1>
          <div className={styles.heroTagline}>
            {taglineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>

          <div className={styles.heroMeta}>
            <p className={styles.heroMetaLine}>{heroDate}</p>
            {heroTime ? <p className={styles.heroMetaLine}>{heroTime}</p> : null}
            <p className={styles.heroMetaLine}>{heroVenue}</p>
          </div>
        </div>

        <a href="#about" className={styles.scrollHint}>
          <span className={styles.scrollHintText}>Scroll to explore</span>
          <span className={styles.scrollHintIcon} aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
