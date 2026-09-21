"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroOverlay({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const doneRef = useRef(false);
  const watchdogRef = useRef(null);

  function dismiss() {
    if (doneRef.current) return;
    doneRef.current = true;
    clearTimeout(watchdogRef.current);
    const video = videoRef.current;
    if (video) video.pause();
    setDone(true); // triggers the CSS fade/blur/scale/glow
    onDone && onDone(); // unlocks scroll + starts hero entrance animations
    setTimeout(() => {
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
      setVisible(false); // remove overlay from the DOM
    }, 1200);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      dismiss();
      return;
    }
    video.muted = false; // try with sound; browsers may refuse without a gesture
    video
      .play()
      .catch(() => {
        video.muted = true;
        return video.play();
      })
      .catch(dismiss)
      .finally(() => setMuted(video.muted));

    watchdogRef.current = setTimeout(dismiss, 10000); // video never started -> go to site

    return () => clearTimeout(watchdogRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div id="intro-overlay" role="dialog" aria-label="Kratos'26 intro" className={done ? "done" : playing ? "playing" : ""}>
      <div className="intro-inner">
        <img src="/assets/img/lion-logo.webp" alt="" />
        <span>LOADING KRATOS&apos;26...</span>
      </div>
      <video
        id="introVideo"
        ref={videoRef}
        className="intro-video"
        src="/assets/video/nandatha.mp4"
        muted={false}
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onPlaying={() => {
          setPlaying(true);
          clearTimeout(watchdogRef.current);
        }}
        onEnded={dismiss}
        onError={dismiss}
      />
      <div className="intro-glow" />
      <div className="intro-controls">
        <button
          className="intro-sound"
          id="introSound"
          type="button"
          aria-pressed={!muted}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            video.muted = !video.muted;
            if (video.paused && !doneRef.current) video.play().catch(() => {});
            setMuted(video.muted);
          }}
        >
          Sound: {muted ? "Off" : "On"}
        </button>
        <button className="intro-skip" id="introSkip" type="button" onClick={dismiss} autoFocus>
          Skip intro
        </button>
      </div>
    </div>
  );
}
