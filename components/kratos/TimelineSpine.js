"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import SectionReveal from "./SectionReveal";

/**
 * Sacred Timeline — categories as branch nodes from live API data.
 * Purpose: spatial consistency + explanation (marketing, occasional).
 */
export default function TimelineSpine({ categories = [], loading, error }) {
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="timeline-sec">
      <div className="container">
        <SectionReveal className="sec-head timeline-head">
          <span className="eyebrow">Sacred Timeline</span>
          <h2>Branches of KRATOS</h2>
          <p>Every track is a node on the timeline. Follow a branch to its events.</p>
        </SectionReveal>

        {loading && <p className="state-msg">Loading timeline nodes…</p>}
        {error && (
          <p className="state-msg state-error" role="alert">
            Timeline unavailable: {error.message || "Could not load events"}
          </p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="state-msg">No categories yet — events will appear here when published.</p>
        )}

        {categories.length > 0 && (
          <div className="timeline-spine" role="list">
            <div className="timeline-rail" aria-hidden />
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                role="listitem"
                className={`timeline-node${i % 2 === 0 ? " node-left" : " node-right"}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduce ? 0.2 : 0.4,
                  delay: reduce ? 0 : i * 0.06,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <span className="node-dot" aria-hidden />
                <Link href={`/categories/${cat.slug}`} className="node-panel">
                  <span className="node-coord">BR · {String(i + 1).padStart(2, "0")}</span>
                  <h3>{cat.label}</h3>
                  <p>
                    {cat.count} event{cat.count === 1 ? "" : "s"}
                  </p>
                  <span className="node-cta">
                    Open branch <i>→</i>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
