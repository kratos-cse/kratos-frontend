"use client";

import { Input, Select } from "@/components/ui/Input";
import { fieldChoices } from "@/lib/registration/fieldUtils";

export function DynamicField({ field, value, onChange, disabled }) {
  const label = field.label;
  const required = field.required;
  const choices = fieldChoices(field.options);

  if (field.field_type === "TEXTAREA") {
    return (
      <label style={{ display: "grid", gap: 6 }}>
        <span>{label}{required ? " *" : ""}</span>
        <textarea
          rows={4}
          disabled={disabled}
          placeholder={field.placeholder || ""}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
        {field.help_text ? <small>{field.help_text}</small> : null}
      </label>
    );
  }

  if (field.field_type === "SINGLE_SELECT" || field.field_type === "MCQ") {
    return (
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 8 }}>{label}{required ? " *" : ""}</legend>
        {choices.map((c) => (
          <label key={c} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              type="radio"
              name={field.field_key}
              disabled={disabled}
              checked={value === c}
              onChange={() => onChange(field.id, c)}
            />
            {c}
          </label>
        ))}
        {field.help_text ? <small>{field.help_text}</small> : null}
      </fieldset>
    );
  }

  if (field.field_type === "MULTI_SELECT") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 8 }}>{label}{required ? " *" : ""}</legend>
        {choices.map((c) => (
          <label key={c} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={selected.includes(c)}
              onChange={(e) => {
                const next = e.target.checked ? [...selected, c] : selected.filter((x) => x !== c);
                onChange(field.id, next);
              }}
            />
            {c}
          </label>
        ))}
      </fieldset>
    );
  }

  if (field.field_type === "CHECKBOX") {
    return (
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          disabled={disabled}
          checked={Boolean(value)}
          onChange={(e) => onChange(field.id, e.target.checked)}
        />
        {label}{required ? " *" : ""}
      </label>
    );
  }

  const inputType =
    field.field_type === "NUMBER"
      ? "number"
      : field.field_type === "EMAIL"
        ? "email"
        : field.field_type === "PHONE"
          ? "tel"
          : field.field_type === "DATE"
            ? "date"
            : "text";

  return (
    <Input
      label={`${label}${required ? " *" : ""}`}
      type={inputType}
      disabled={disabled}
      placeholder={field.placeholder || ""}
      hint={field.help_text || undefined}
      value={value || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
    />
  );
}
