"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import styles from "./DepthCarousel.module.css";
import { useReducedMotion } from "motion/react";

export function DepthCarousel({
  children,
  cardWidth = 280,
  cardHeight = 360,
  radius = 18,
  depth = 170,
  spread = 55,
  tilt = 14,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.18,
  blur = 4,
  duration = 650,
  ease = "power3.out",
  autoplay = false,
  loop = true,
  showControls = true,
  showIndicators = true
}) {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduce = useReducedMotion();
  
  const items = React.Children.toArray(children);
  const count = items.length;

  const goTo = (index) => {
    let nextIndex = index;
    if (loop) {
      if (nextIndex < 0) nextIndex = count - 1;
      if (nextIndex >= count) nextIndex = 0;
    } else {
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= count) nextIndex = count - 1;
    }
    setCurrentIndex(nextIndex);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Swipe logic
  const touchStart = useRef(0);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const end = e.changedTouches[0].clientX;
    const diff = touchStart.current - end;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  useEffect(() => {
    const elements = itemsRef.current;
    if (!elements.length || reduce) return;

    elements.forEach((el, i) => {
      if (!el) return;
      const offset = i - currentIndex;
      let diff = offset;
      
      // Handle loop visually
      if (loop) {
        if (offset > count / 2) diff -= count;
        if (offset < -count / 2) diff += count;
      }
      
      const absDiff = Math.abs(diff);
      const isVisible = absDiff <= visibleCards;
      
      if (!isVisible) {
        gsap.to(el, { opacity: 0, zIndex: -10, duration: duration / 1000, ease });
        return;
      }
      
      const sign = Math.sign(diff);
      const x = diff * spread;
      const z = -absDiff * depth;
      const rotateY = tiltDirection === "right" ? diff * -tilt : diff * tilt;
      
      const blurVal = absDiff * blur;
      const scale = Math.max(0, 1 - absDiff * falloff);
      
      gsap.to(el, {
        x,
        z,
        rotateY,
        scale,
        opacity: scale > 0 ? 1 : 0,
        filter: `blur(${blurVal}px)`,
        zIndex: 100 - absDiff,
        duration: duration / 1000,
        ease
      });
    });

    return () => {
      elements.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [currentIndex, count, loop, visibleCards, spread, depth, tilt, tiltDirection, blur, falloff, duration, ease, reduce]);

  if (reduce) {
    return (
      <div className={styles.fallbackContainer}>
        {items.map((child, i) => (
          <div key={i} className={styles.fallbackCard}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={{ perspective: `${perspective}px` }}>
      <div 
        className={styles.container} 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ height: cardHeight }}
      >
        {items.map((child, i) => {
          const isActive = i === currentIndex;
          return (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
            style={{
              width: cardWidth,
              height: cardHeight,
              borderRadius: radius,
            }}
          >
            {child}
          </div>
        )})}
      </div>
      
      {(showControls || showIndicators) && (
        <div className={styles.controls}>
          {showControls && (
            <button className={styles.btn} onClick={prev} aria-label="Previous">←</button>
          )}
          {showIndicators && (
            <div className={styles.indicators}>
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
          {showControls && (
            <button className={styles.btn} onClick={next} aria-label="Next">→</button>
          )}
        </div>
      )}
    </div>
  );
}

