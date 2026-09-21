"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="feedback-form" id="feedbackForm" onSubmit={handleSubmit}>
      <div className="row2">
        <div className="field">
          <label htmlFor="fb-name">Name</label>
          <input id="fb-name" type="text" placeholder="Your name" required />
        </div>
        <div className="field">
          <label htmlFor="fb-college">College</label>
          <input id="fb-college" type="text" placeholder="Your institution" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="fb-event">Track</label>
        <select id="fb-event" defaultValue="Technical">
          <option>Technical</option>
          <option>Spark</option>
          <option>Online</option>
          <option>Sports</option>
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
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="fb-msg">Comments</label>
        <textarea id="fb-msg" placeholder="What worked, what didn't..." />
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
        Submit Feedback
      </button>
      <p className="form-note">{submitted ? "Thank you — feedback recorded." : ""}</p>
    </form>
  );
}
