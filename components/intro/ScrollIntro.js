"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ScrollIntro({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("kratos-intro-seen") !== "true";
  });
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setPhase("exit");
    window.sessionStorage.setItem("kratos-intro-seen", "true");
  }, []);

  useEffect(() => {
    if (!visible) { onDone?.(); return; }
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(dismiss, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dismiss, visible, onDone]);

  const handleTransitionEnd = useCallback((e) => {
    if (phase === "exit" && e.target === e.currentTarget) {
      setVisible(false);
      onDone?.();
    }
  }, [phase, onDone]);

  if (!visible) return null;

  return (
    <div
      className={`intro-overlay intro-phase-${phase}`}
      role="dialog"
      aria-label="Kratos'26 intro"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="intro-content">
        <div className="intro-lion-ring">
          <div className="intro-lion-glow" />
          <img className="intro-lion" src="/assets/img/lion.png" alt="" />
        </div>
        <p className="intro-title">KRATOS&apos;26</p>
        <p className="intro-subtitle">ACE National Symposium</p>
        <button className="intro-skip" type="button" onClick={dismiss}>
          Skip
        </button>
      </div>
    </div>
  );
}
