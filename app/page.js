"use client";

import { Component, Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import KratosHero from "@/components/kratos/KratosHero";
import TimelineSpine from "@/components/kratos/TimelineSpine";
import NexusSection from "@/components/kratos/NexusSection";
import EventExplorer from "@/components/kratos/EventExplorer";
import SectionReveal from "@/components/kratos/SectionReveal";
import { useEvents } from "@/hooks/useEvents";
import { uniqueCategories, rankNexusEvents } from "@/lib/events/utils";
import { useAuth } from "@/context/AuthProvider";

const ScrollIntro = dynamic(() => import("@/components/intro/ScrollIntro"), {
  ssr: false,
});

class HomeErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <HomeLoading /> : this.props.children;
  }
}

function HomeLoading() {
  return (
    <main>
      <div className="container">
        <p className="state-msg">Loading...</p>
      </div>
    </main>
  );
}

export default function Home() {
  const [introActive, setIntroActive] = useState(true);
  const { events: fetchedEvents, loading, error } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const session = useMemo(() => (isAuthenticated ? { authenticated: true } : null), [isAuthenticated]);
  const events = useMemo(() => fetchedEvents ?? [], [fetchedEvents]);
  const categories = useMemo(() => uniqueCategories(events), [events]);
  const nexus = useMemo(() => rankNexusEvents(events, 4), [events]);

  useEffect(() => {
    document.body.classList.add("intro-active");
    console.log("Home page mounted");
    document.body.classList.remove("intro-done");
    return () => {
      console.log("Home page unmounted");
      document.body.classList.remove("intro-active");
      document.body.classList.remove("intro-done");
      document.documentElement.classList.remove("intro-doc-lock");
      document.body.classList.remove("intro-doc-lock");
      document.body.classList.remove("kratos-stage");
    };
  }, []);

  useEffect(() => {
    console.log("Home rendered", { session, user });
  }, [session, user]);

  useEffect(() => {
    if (window.sessionStorage.getItem("kratos-intro-seen") === "1") {
      setIntroActive(false);
      document.body.classList.remove("intro-active");
    }
  }, []);

  function handleIntroDone() {
    setIntroActive(false);
    window.sessionStorage.setItem("kratos-intro-seen", "1");
    document.body.classList.remove("intro-active");
    document.body.classList.remove("kratos-stage");
    document.documentElement.classList.remove("intro-doc-lock");
    document.body.classList.remove("intro-doc-lock");
    document.body.classList.add("intro-done");
  }

  return (
    <>
      {introActive && <ScrollIntro onDone={handleIntroDone} />}
      <div className="landing-shell" {...(introActive ? { inert: "" } : {})}>
        <KratosNav />
        <HomeErrorBoundary>
          <Suspense fallback={<HomeLoading />}>
            <main>
          <KratosHero />

          <section id="discovery" className="discovery-sec">
            <div className="container">
              <SectionReveal className="discovery-panel">
                <span className="eyebrow">Discovery</span>
                <h2>What is KRATOS?</h2>
                <p>
                  KRATOS&apos;26 is the ACE National Symposium at SRM Easwari Engineering College —
                  a single timeline of technical, cultural, and competitive branches. You enter through
                  the opening sequence, choose a node, and register for the events that define your path.
                </p>
              </SectionReveal>
            </div>
          </section>

          <TimelineSpine categories={categories} loading={loading} error={error} />
          <NexusSection events={nexus} loading={loading} />
          <EventExplorer events={events} loading={loading} error={error} limit={8} />

          <section id="dates" className="dates-sec">
            <div className="container">
              <SectionReveal className="sec-head">
                <span className="eyebrow">Important Dates</span>
                <h2>Mark the convergence</h2>
                <p>Symposium day is locked. Registration windows follow each event&apos;s own rules.</p>
              </SectionReveal>
              <div className="dates-rail">
                <div className="date-node">
                  <span className="node-coord">D · 01</span>
                  <h3>20 March 2026</h3>
                  <p>Symposium day — SRM Easwari, Ramapuram</p>
                </div>
                <div className="date-node">
                  <span className="node-coord">D · 02</span>
                  <h3>Registration windows</h3>
                  <p>Per-event open/close times from the live catalogue</p>
                </div>
                <div className="date-node">
                  <span className="node-coord">D · 03</span>
                  <h3>Check-in</h3>
                  <p>QR confirmation after successful payment / team join</p>
                </div>
              </div>
            </div>
          </section>

          <section id="register-cta" className="cta-sec">
            <div className="container">
              <SectionReveal className="cta-panel">
                <span className="eyebrow">Participation</span>
                <h2>Claim your place on the timeline</h2>
                <p>Sign in, complete your profile, register, and pay only when the backend confirms an order.</p>
                <div className="hero-cta">
                  <Link href="/events" className="btn btn-primary">
                    Browse Events
                  </Link>
                  <Link href="/login?next=/dashboard" className="btn btn-ghost">
                    Sign in
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </section>
            </main>
            <div className="stats-bar">
              <div className="m">
                <b>1</b>
                <small>Day of Symposium</small>
              </div>
              <div className="m">
                <b>{loading ? "—" : categories.length}</b>
                <small>Timeline Branches</small>
              </div>
              <div className="m">
                <b>{loading ? "—" : events.length}</b>
                <small>Live Events</small>
              </div>
            </div>
            <KratosFooter categories={categories} />
          </Suspense>
        </HomeErrorBoundary>
      </div>
    </>
  );
}
