"use client";

import { useState } from "react";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";

/**
 * Feedback UI is accessible but submission is disabled until a backend endpoint exists.
 * Do not fake success.
 */
export default function FeedbackPage() {
  const [rating, setRating] = useState(0);

  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Tell Us Where It Landed</span>
            <h1>Feedback</h1>
            <p>Whether you competed, judged, or just walked through — this shapes next year&apos;s symposium.</p>
          </div>
        </section>
        <section id="feedback">
          <div className="container">
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps?q=SRM+Easwari+Engineering+College,+Ramapuram,+Chennai&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Map"
              />
            </div>
            <div className="feedback-panel">
              <div className="feedback-copy">
                <h3>Why it matters</h3>
                <p>Every response is read by the organizing core before next year&apos;s planning.</p>
                <ul>
                  <li>Shapes which events return, merge, or retire</li>
                  <li>Flags scheduling clashes across tracks</li>
                  <li>Surfaces judging and logistics issues early</li>
                </ul>
              </div>
              <div>
                <div className="feedback-pending" role="status">
                  Feedback submission is pending backend support. There is no feedback API in the current
                  KRATOS backend — this form cannot save responses yet.
                </div>
                <form
                  className="feedback-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <fieldset disabled>
                    <div className="row2">
                      <div className="field">
                        <label htmlFor="fb-name">Name</label>
                        <input id="fb-name" type="text" placeholder="Your name" />
                      </div>
                      <div className="field">
                        <label htmlFor="fb-college">College</label>
                        <input id="fb-college" type="text" placeholder="Your institution" />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="fb-event">Track</label>
                      <select id="fb-event" defaultValue="">
                        <option value="" disabled>
                          Select when available
                        </option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Overall experience</label>
                      <div className="rating" id="ratingGroup">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={rating === n ? "active" : ""}
                            onClick={() => setRating(n)}
                            aria-pressed={rating === n}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="fb-msg">Message</label>
                      <textarea id="fb-msg" rows={5} placeholder="What should we improve?" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled>
                      Submission unavailable
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
