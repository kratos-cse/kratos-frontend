"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DarkVeil } from "@/components/motion/DarkVeil";
import { PAPYRUS_REGISTRATION_URL } from "@/lib/links";
import styles from "../papyrus.module.css";

export default function PapyrusHero({
  tagline,
  description,
  heroDate,
  heroVenue,
}) {
  const heroSectionRef = useRef(null);

  return (
    <section ref={heroSectionRef} className={styles.heroSection}>
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
          <p className={styles.tagline}>{tagline}</p>
          <p className={styles.heroDescription}>{description}</p>

          <div className={styles.eventInfo}>
            <span className={`${styles.infoBadge} ${styles.infoBadgeHighlight}`}>
              {heroDate}
            </span>
            <span className={styles.infoBadge}>{heroVenue}</span>
          </div>

          <div className={styles.ctaGroup}>
            <Button
              href={PAPYRUS_REGISTRATION_URL}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register now (opens Google Form in a new tab)"
            >
              Register Now
            </Button>
            <Button href="#themes" variant="secondary" size="lg">
              Explore Themes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
