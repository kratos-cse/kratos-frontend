"use client";

export default function HtfProblemCard({ ps, onView }) {
  const focusTags = ps.tagAreas.slice(0, 3);

  return (
    <article className="htf-ps-brief">
      <div className="htf-ps-brief__border" aria-hidden="true" />
      <div className="htf-ps-brief__inner">
        <header className="htf-ps-brief__top">
          <span className="htf-ps-brief__id">PS {ps.number}</span>
          <span className="htf-ps-brief__label">Problem brief</span>
        </header>

        <h3 className="htf-ps-brief__title">{ps.title}</h3>
        <p className="htf-ps-brief__summary">{ps.challengeSummary}</p>

        <div className="htf-ps-brief__footer">
          <div className="htf-ps-brief__focus">
            <span className="htf-ps-brief__focus-label">Key focus</span>
            <ul className="htf-ps-brief__tags">
              {focusTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="htf-ps-brief__cta"
            onClick={(e) => onView(ps, e.currentTarget)}
          >
            View full problem statement →
          </button>
        </div>
      </div>
    </article>
  );
}
