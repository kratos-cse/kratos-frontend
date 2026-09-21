"use client";

import Link from "next/link";
import Countdown from "@/components/Countdown";

/**
 * Post-intro discovery hero — brand-first, one composition.
 * Lion + wordmark remain the hero signal (intro handoff targets).
 */
export default function KratosHero() {
  return (
    <section id="home" className="hero kratos-hero">
      <div className="brand-stack">
        <div className="lion-wrap" id="landing-lion">
          <div className="lion-glow" />
          <img src="/assets/img/lion.png" alt="ACE lion mark" />
        </div>
        <img
          className="wordmark-img"
          id="landing-wordmark"
          src="/assets/img/kratos-wordmark.webp"
          alt="Kratos'26"
        />
      </div>
      <p className="hero-tagline">
        The ACE National Symposium — enter the timeline, choose your branch, reach the nexus.
      </p>
      <Countdown />
      <div className="hero-cta">
        <a href="#timeline" className="btn btn-primary">
          Enter Timeline
        </a>
        <Link href="/events" className="btn btn-ghost">
          Explore Events
        </Link>
      </div>
    </section>
  );
}
