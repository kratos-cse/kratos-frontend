import React from "react";

export default function DomainCard({ number, title, subtitle, desc, icon, tags = [], variant = 1 }) {
  return (
    <article className={`domain-card domain-card--${variant}`}>
      <div className="domain-card__border" aria-hidden="true" />
      <div className="domain-card__inner">
        <div className="domain-card__number">{number}</div>

        <div className="domain-card__body">
          <div className="domain-card__eyebrow">
            <span className="domain-card__dot" /> TRACK {number}
          </div>
          <h3>{title}</h3>
          <p className="domain-card__subtitle">{subtitle}</p>
          <p className="domain-card__desc">{desc}</p>

          <div className="domain-card__tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}
