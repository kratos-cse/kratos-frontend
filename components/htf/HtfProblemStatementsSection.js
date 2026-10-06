"use client";

import { useState, useCallback, useEffect } from "react";
import { HTF_PROBLEM_STATEMENTS } from "@/data/htfProblemStatements";
import HtfScrollStack, { HtfScrollStackItem } from "@/components/htf/ScrollStack/HtfScrollStack";
import HtfProblemCard from "@/components/htf/HtfProblemCard";
import HtfProblemDetailModal from "@/components/htf/HtfProblemDetailModal";
import StackedCardStack from "@/components/htf/StackedCardStack";

export default function HtfProblemStatementsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailPs, setDetailPs] = useState(null);
  const [useMotionStack, setUseMotionStack] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setUseMotionStack(!mq.matches);
    const onChange = () => setUseMotionStack(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onView = useCallback((ps) => setDetailPs(ps), []);
  const onClose = useCallback(() => setDetailPs(null), []);

  const total = HTF_PROBLEM_STATEMENTS.length;
  const activeLabel = String(activeIndex + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <section id="problem-statements" className="domains-stack-section htf-ps-section">
      <div className="container">
        <div className="htf-ps-section__head">
          <div>
            <h2 className="section-title">Problem <span>Statements</span></h2>
            <p className="section-sub">Four challenges. Build something that works.</p>
          </div>
          <div className="htf-ps-progress" aria-live="polite">
            <span className="htf-ps-progress__count">{activeLabel} / {totalLabel}</span>
            <div className="htf-ps-progress__dots" role="tablist" aria-label="Problem statement progress">
              {HTF_PROBLEM_STATEMENTS.map((ps, i) => (
                <span
                  key={ps.id}
                  className={i === activeIndex ? "htf-ps-progress__dot is-active" : "htf-ps-progress__dot"}
                  aria-current={i === activeIndex ? "step" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {useMotionStack ? (
        <HtfScrollStack
          itemDistance={100}
          itemStackDistance={24}
          stackPosition="22%"
          baseScale={0.9}
          itemScale={0.035}
          onActiveIndexChange={setActiveIndex}
        >
          {HTF_PROBLEM_STATEMENTS.map((ps, i) => (
            <HtfScrollStackItem key={ps.id}>
              <HtfProblemCard ps={ps} variant={(i % 6) + 1} onView={onView} />
            </HtfScrollStackItem>
          ))}
        </HtfScrollStack>
      ) : (
        <div className="container">
          <StackedCardStack topOffset={86} stackGap={18} cardMinHeight="min(72vh, 640px)">
            {HTF_PROBLEM_STATEMENTS.map((ps, i) => (
              <HtfProblemCard key={ps.id} ps={ps} variant={(i % 6) + 1} onView={onView} />
            ))}
          </StackedCardStack>
        </div>
      )}

      <HtfProblemDetailModal ps={detailPs} open={Boolean(detailPs)} onClose={onClose} />
    </section>
  );
}
