"use client";

import { useRef } from "react";
import Image from "next/image";
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
        <div className={styles.heroInstitutionalRow} aria-label="Host and affiliate logos">
          <div className={styles.heroEecBrand}>
            <Image
              src="/eec-white.png"
              alt="Easwari Engineering College"
              width={320}
              height={80}
              className={styles.logoEec}
              priority
              sizes="(max-width: 480px) 160px, 260px"
            />
          </div>
          <div className={styles.heroCsiBrand}>
            <Image
              src="/CSI.png"
              alt="Computer Society of India"
              width={128}
              height={128}
              className={styles.logoCsi}
              sizes="112px"
            />
          </div>
        </div>

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
