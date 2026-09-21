"use client";

export default function TeamSizeStepper({ value, min = 2, max = 10, onChange }) {
  const safeMin = Math.max(1, Number(min) || 1);
  const safeMax = Math.max(safeMin, Number(max) || safeMin);
  const current = Math.min(safeMax, Math.max(safeMin, Number(value) || safeMin));

  return (
    <div>
      <p className="muted" style={{ textAlign: "center" }}>
        How many people are in your team?
      </p>
      <div className="team-stepper" role="group" aria-label="Team size">
        <button
          type="button"
          aria-label="Decrease team size"
          disabled={current <= safeMin}
          onClick={() => onChange?.(current - 1)}
        >
          −
        </button>
        <span className="count" aria-live="polite">
          {current}
        </span>
        <button
          type="button"
          aria-label="Increase team size"
          disabled={current >= safeMax}
          onClick={() => onChange?.(current + 1)}
        >
          +
        </button>
      </div>
      <p className="muted" style={{ textAlign: "center" }}>
        Allowed {safeMin}–{safeMax}. You will be the team leader.
      </p>
    </div>
  );
}
