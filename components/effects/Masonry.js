"use client";

/**
 * Adapted from React Bits Masonry (content/Components/Masonry).
 * CSS-columns masonry (no measured JS layout) so it stays dependency-free —
 * items reflow responsively and animate in on scroll, with a hover
 * lift + focus effect that mirrors the reference reel.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Masonry.module.css";

const EASE_OUT = [0.23, 1, 0.32, 1];

export function Masonry({ items }) {
  const reduce = useReducedMotion();

  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <motion.figure
          key={item.id}
          className={styles.item}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(24px) scale(0.97)" }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: Math.min(index, 10) * 0.05, ease: EASE_OUT }}
        >
          <div className={styles.frame}>
            <Image
              src={item.img}
              alt={item.alt || ""}
              width={item.width || 800}
              height={item.height || 600}
              className={styles.image}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            />
            {item.caption ? <figcaption className={styles.caption}>{item.caption}</figcaption> : null}
          </div>
        </motion.figure>
      ))}
    </div>
  );
}
