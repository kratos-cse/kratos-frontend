"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import RegistrationsPanel from "@/components/RegistrationsPanel";
import IntroOverlay from "@/components/IntroOverlay";

const TYPE_CARDS = [
  {
    href: "/spark",
    className: "tc-spark",
    icon: (
      <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    ),
    title: "Spark Events",
    desc: "Keynotes, ceremonies & the moments that ignite the symposium.",
  },
  {
    href: "/technical",
    className: "tc-technical",
    icon: <path d="M8 5l-6 7 6 7M16 5l6 7-6 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Technical Events",
    desc: "Code Crucible, Project Expo & more — logic meets deadline.",
  },
  {
    href: "/online",
    className: "tc-online",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9s1.3-6.4 3.8-9z" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
    title: "Online Events",
    desc: "48-hour sprints & async challenges, open to every college.",
  },
  {
    href: "/sports",
    className: "tc-sports",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M12 3v18M3 12h18M6 6.5c2 1.6 4 2.2 6 2.2s4-.6 6-2.2M6 17.5c2-1.6 4-2.2 6-2.2s4 .6 6 2.2"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </>
    ),
    title: "Sports Events",
    desc: "Football, courts & the ground — where the symposium gets physical.",
  },
  {
    href: "/technical",
    className: "tc-hackathon",
    icon: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
    title: "Hackathon",
    desc: "Overnight build sprints — one problem statement, one shipped product.",
  },
  {
    href: "/technical",
    className: "tc-workshop",
    icon: <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L15 12l-1.7-1.7 1.4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />,
    title: "Workshop",
    desc: "Hands-on sessions with industry mentors — skills you take home.",
  },
];

export default function Home() {
  const [introActive, setIntroActive] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    if (window.location.hash === "#registrations") setPanelOpen(true);
  }, []);

  function handleIntroDone() {
    setIntroActive(false);
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-done");
  }

  function handleSignIn(e) {
    e.preventDefault();
    setPanelOpen(true);
    document.getElementById("registrations")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <IntroOverlay onDone={handleIntroDone} />
      <div {...(introActive ? { inert: "" } : {})}>
        <Header onSignIn={handleSignIn} />
        <main>
          <section id="home" className="hero">
            <div className="lion-wrap">
              <div className="lion-glow" />
              <img src="/assets/img/lion-logo.webp" alt="ACE lion mark" />
            </div>
            <img className="wordmark-img" src="/assets/img/kratos-wordmark.webp" alt="Kratos'26" />
            <Countdown />
            <div className="hero-cta">
              <Link href="/technical" className="btn btn-primary">
                Explore Events
              </Link>
              <Link href="/feedback" className="btn btn-ghost">
                Share Feedback
              </Link>
            </div>
          </section>

          <section id="pillars" className="types-sec">
            <div className="pillars-mesh" />
            <div className="pillars-head">
              <span className="eyebrow">Pick Your Track</span>
              <h2>Explore Event Types</h2>
              <p>Six arenas, one symposium. Find where you belong.</p>
            </div>
            <div className="types-grid">
              {TYPE_CARDS.map((card) => (
                <Link key={card.title} href={card.href} className={`type-card ${card.className}`}>
                  <div className="tc-glow" />
                  <span className="tc-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      {card.icon}
                    </svg>
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="tc-cta">
                    Explore <i>→</i>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <RegistrationsPanel open={panelOpen} />
        </main>
        <div className="stats-bar">
          <div className="m">
            <b data-live="symposium-days">1</b>
            <small>Day of Symposium</small>
          </div>
          <div className="m">
            <b data-live="event-tracks">4</b>
            <small>Event Tracks</small>
          </div>
          <div className="m">
            <b data-live="total-events">6</b>
            <small>Total Events</small>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
