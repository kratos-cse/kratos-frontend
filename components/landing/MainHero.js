"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./MainHero.module.css";

export function MainHero() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        opacity: 0.2 + Math.random() * 0.6,
      }))
    );
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.stars} aria-hidden>
        {stars.map((s, i) => (
          <span key={i} style={s} />
        ))}
      </div>
      <div className={styles.vignette} aria-hidden />

      <div className={styles.content}>
        {/* Slot only — the single persistent lion (LionJourney) sits here at 0% scroll */}
        <div className={styles.lionSlot} data-lion-anchor="start" aria-hidden />
        <Image
          src="/kratos26.png"
          alt="KRATOS'26"
          width={480}
          height={140}
          priority
          className={styles.logo}
        />
        <p className={styles.desc}>
          Discover events. Register in minutes. Manage your team and<br />ticket in one place.
        </p>
        <div className={styles.actions}>
          <Link href="/events" className={styles.btnRed}>
            Explore Events
          </Link>
          <Link href="/profile" className={styles.btnDark}>
            My Registrations
          </Link>
        </div>
      </div>
    </section>
  );
}
