"use client";

const PROFILE_FIELDS = [
  ["full_name", "Full name", true],
  ["phone", "Phone", true],
  ["college_name", "College", true],
  ["department", "Department", true],
  ["year_of_study", "Year of study", true],
];

export function getMissingProfileKeys(profile) {
  return PROFILE_FIELDS.filter(([key, , required]) => required && !profile?.[key]).map(([key]) => key);
}

/**
 * Only incomplete required fields are editable. Email from Google is read-only.
 */
export default function ProfileConfirm({
  form,
  setForm,
  email,
  missingKeys,
  onSubmit,
  busy,
  submitLabel = "Continue",
}) {
  const showAll = !missingKeys || missingKeys.length === 0;
  const keysToShow = showAll ? PROFILE_FIELDS.map(([k]) => k) : missingKeys;

  return (
    <form
      className="profile-fields"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
    >
      <p className="muted">
        {showAll
          ? "Confirm your details before continuing."
          : "Only a few details are missing — fill these to continue."}
      </p>
      <div className="field">
        <label htmlFor="pc-email">Email</label>
        <input id="pc-email" value={email || ""} readOnly />
      </div>
      {PROFILE_FIELDS.filter(([key]) => keysToShow.includes(key)).map(([key, label, required]) => (
        <div className="field" key={key}>
          <label htmlFor={`pc-${key}`}>{label}</label>
          <input
            id={`pc-${key}`}
            value={form[key] || ""}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            required={required}
            autoComplete="off"
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
