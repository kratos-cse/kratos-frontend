"use client";

import { useState, useCallback, useRef } from "react";
import { HTF_PROBLEM_STATEMENTS } from "@/data/htfProblemStatements";
import StackedCardStack from "@/components/htf/StackedCardStack";
import HtfProblemCard from "@/components/htf/HtfProblemCard";
import HtfProblemDetailModal from "@/components/htf/HtfProblemDetailModal";

export default function HtfProblemStatementsSection() {
  const [detailPs, setDetailPs] = useState(null);
  const returnFocusRef = useRef(null);

  const onView = useCallback((ps, triggerEl) => {
    returnFocusRef.current = triggerEl;
    setDetailPs(ps);
  }, []);

  const onClose = useCallback(() => {
    setDetailPs(null);
    const el = returnFocusRef.current;
    if (el && typeof el.focus === "function") {
      requestAnimationFrame(() => el.focus());
    }
  }, []);

  return (
    <section id="problem-statements" className="domains-stack-section htf-ps-section">
      <div className="container">
        <h2 className="section-title">Problem <span>Statements</span></h2>
        <p className="section-sub">Four challenges. Build something that works.</p>
      </div>

      <StackedCardStack topOffset={86} stackGap={18} cardMinHeight="560px">
        {HTF_PROBLEM_STATEMENTS.map((ps) => (
          <HtfProblemCard key={ps.id} ps={ps} onView={onView} />
        ))}
      </StackedCardStack>

      <HtfProblemDetailModal ps={detailPs} open={Boolean(detailPs)} onClose={onClose} />
    </section>
  );
}
