"use client";

export default function RegistrationPreview({ rows = [], onEdit, onConfirm, busy, confirmLabel = "Confirm registration" }) {
  return (
    <div>
      <h2 className="profile-title" style={{ marginBottom: 8 }}>
        Confirm your registration
      </h2>
      <div className="confirm-list">
        {rows.map(([label, value]) => (
          <div className="row" key={label}>
            <span>{label}</span>
            <strong>{value || "—"}</strong>
          </div>
        ))}
      </div>
      <div className="action-row">
        {onEdit ? (
          <button type="button" className="btn btn-ghost" onClick={onEdit} disabled={busy}>
            Edit
          </button>
        ) : null}
        <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={busy}>
          {busy ? "Submitting…" : confirmLabel}
        </button>
      </div>
    </div>
  );
}
