"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../papyrus.module.css";

const ThemeCarousel = dynamic(() => import("./ThemeCarousel"), {
  ssr: false,
  loading: () => <div className={styles.carouselPlaceholder} aria-hidden="true" />,
});

export default function ThemesSection({ themes }) {
  const sectionRef = useRef(null);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShowCarousel(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowCarousel(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="themes" ref={sectionRef} className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Themes</h2>
        <p className={styles.sectionLead}>Seven symposium domains for your research paper.</p>
      </div>
      {showCarousel ? (
        <ThemeCarousel themes={themes} />
      ) : (
        <div className={styles.carouselPlaceholder} aria-hidden="true" />
      )}
    </section>
  );
}
