"use client";

import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";

export default function SportsPage() {
  return (
    <div className="landing-shell">
      <KratosNav />
      <main>
        <img className="lion-watermark" src="/assets/img/lion.png" alt="" aria-hidden="true" />
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Arena Floor</span>
            <h1>Sports Events</h1>
            <p>Step outside the lab and settle things on the field.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <p className="state-msg">No sports events published yet — check back soon.</p>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
