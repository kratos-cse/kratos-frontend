"use client";

import { useEffect, useRef, useState } from "react";

const EVENTS = [
  { date: "14 Oct 2026", time: "08:00 AM", title: "Registration & Check-in", desc: "Teams arrive, verify registration, and collect their kits." },
  { date: "14 Oct 2026", time: "10:00 AM", title: "Inauguration & PS Reveal", desc: "Opening ceremony and problem statements are revealed." },
  { date: "14 Oct 2026", time: "11:00 AM", title: "Hacking Begins", desc: "The 24-hour build window officially starts." },
  { date: "14 Oct 2026", time: "09:00 PM", title: "Mentor Round 1", desc: "Teams receive a progress check and technical guidance." },
  { date: "15 Oct 2026", time: "08:00 AM", title: "Mentor Round 2", desc: "Final mentoring and polish before submissions close." },
  { date: "15 Oct 2026", time: "11:00 AM", title: "Submissions Close", desc: "Code freeze. Teams prepare their final demonstrations." },
  { date: "15 Oct 2026", time: "12:00 PM", title: "Final Judging", desc: "Shortlisted teams present their projects to the judges." },
  { date: "15 Oct 2026", time: "03:00 PM", title: "Closing Ceremony", desc: "Winners are announced and prizes are distributed." },
];

export default function Timeline() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.72;
      const end = viewport * 0.28;
      const total = rect.height + start - end;
      const travelled = start - rect.top;
      const next = Math.max(0, Math.min(100, (travelled / total) * 100));
      setProgress(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="timeline" className="htf-timeline-section">
      <div className="container">
        <div className="timeline-heading">
          <h2 className="section-title">Event <span>Timeline</span></h2>
          <p className="section-sub">14th ΓÇô 15th October 2026</p>
        </div>

        <div
          ref={ref}
          className="htf-timeline"
          style={{ "--timeline-progress": `${progress}%` }}
        >
          <div className="htf-timeline__line" />
          <div className="htf-timeline__progress" />

          {EVENTS.map((event, index) => {
            const threshold = (index / (EVENTS.length - 1)) * 100;
            const active = progress >= threshold - 5;

            return (
              <article className={`htf-timeline__item ${active ? "is-active" : ""}`} key={`${event.date}-${event.time}`}>
                <div className="htf-timeline__dot"><span /></div>

                <div className="htf-timeline__date">
                  <strong>{event.date}</strong>
                  <span>{event.time}</span>
                </div>

                <div className="htf-timeline__content">
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
