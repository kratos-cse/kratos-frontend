"use client";

import { useEffect, useState } from "react";
import { DepthCarousel } from "@/components/motion/DepthCarousel";
import styles from "../papyrus.module.css";

const MOBILE_PROPS = {
  cardWidth: 190,
  cardHeight: 255,
  depth: 65,
  spread: 45,
  tilt: 4,
  perspective: 850,
  visibleCards: 3,
  falloff: 0.15,
  blur: 2,
};

const TABLET_PROPS = {
  cardWidth: 220,
  cardHeight: 290,
  depth: 100,
  spread: 65,
  tilt: 7,
  perspective: 1000,
  visibleCards: 3,
  falloff: 0.18,
  blur: 3,
};

const DESKTOP_PROPS = {
  cardWidth: 280,
  cardHeight: 360,
  depth: 170,
  spread: 90,
  tilt: 10,
  perspective: 1400,
  visibleCards: 4,
  falloff: 0.22,
  blur: 4,
};

function getCarouselProps() {
  if (typeof window === "undefined") return MOBILE_PROPS;
  const w = window.innerWidth;
  if (w <= 480) return MOBILE_PROPS;
  if (w <= 768) return TABLET_PROPS;
  return DESKTOP_PROPS;
}

export default function ThemeCarousel({ themes }) {
  const [carouselProps, setCarouselProps] = useState(MOBILE_PROPS);

  useEffect(() => {
    setCarouselProps(getCarouselProps());
    const onResize = () => setCarouselProps(getCarouselProps());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <DepthCarousel
        {...carouselProps}
        radius={18}
        tiltDirection="right"
        duration={650}
        ease="power3.out"
        loop
        showControls
        showIndicators
      >
        {themes.map((title, idx) => {
          const num = String(idx + 1).padStart(2, "0");
          return (
            <div key={title} className={styles.carouselCardInner}>
              <div className={styles.themeNum}>{num}</div>
              <div className={styles.themeTitle}>{title}</div>
            </div>
          );
        })}
      </DepthCarousel>
    </div>
  );
}
