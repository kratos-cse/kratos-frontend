"use client";

import { useState, useEffect, useRef } from "react";

export default function Splash() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);
  const vidRef = useRef(null);

  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    // When video ends, fade out splash
    const onEnd = () => {
      setHide(true);
      setTimeout(() => setGone(true), 800);
    };

    vid.addEventListener("ended", onEnd);

    // Fallback: if video doesn't fire ended (e.g. mobile), auto-dismiss after 10s
    const fallback = setTimeout(onEnd, 10500);

    return () => {
      vid.removeEventListener("ended", onEnd);
      clearTimeout(fallback);
    };
  }, []);

  // Allow skip on click/tap
  function handleSkip() {
    setHide(true);
    setTimeout(() => setGone(true), 800);
  }

  if (gone) return null;

  return (
    <div className={`splash ${hide ? "hide" : ""}`} onClick={handleSkip}>
      <video
        ref={vidRef}
        className="splash-video"
        autoPlay
        muted
        playsInline
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
      <div className="splash-skip">TAP TO SKIP</div>
    </div>
  );
}
