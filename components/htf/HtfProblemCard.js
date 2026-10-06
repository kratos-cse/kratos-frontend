"use client";

export default function HtfProblemCard({ ps, variant = 1, onView }) {
  return (
    <article className={`domain-card domain-card--${variant}`}>
      <div className="domain-card__border" aria-hidden="true" />
      <div className="domain-card__inner domain-card__inner--ps">
        <div className="domain-card__number">{ps.number}</div>
        <div className="domain-card__body">
          <div className="domain-card__eyebrow">
            <span className="domain-card__dot" /> PS {ps.number}
          </div>
          <h3 className="domain-card__ps-title">{ps.title}</h3>
          <p className="domain-card__desc domain-card__ps-summary">{ps.challengeSummary}</p>
          <div className="domain-card__tags">
            {ps.tagAreas.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button type="button" className="domain-card__view-btn" onClick={() => onView(ps)}>
            View Problem Statement →
          </button>
        </div>
      </div>
    </article>
  );
}
