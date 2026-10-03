"use client";

import { Input, Select } from "@/components/ui/Input";

function fieldChoices(field) {
  const raw = field.options;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.choices) return raw.choices;
  if (raw.options) return raw.options;
  return [];
}

export function DynamicFieldForm({ fields = [], values = {}, onChange, disabled }) {
  const customFields = fields.filter((f) => f.is_visible && f.source === "CUSTOM");
  if (!customFields.length) return null;

  function setValue(fieldId, value) {
    onChange({ ...values, [fieldId]: value });
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {customFields.map((field) => {
        const val = values[field.id];
        const choices = fieldChoices(field);

        if (field.field_type === "TEXTAREA") {
          return (
            <label key={field.id} style={{ display: "grid", gap: 6 }}>
              <span>{field.label}{field.required ? " *" : ""}</span>
              <textarea
                rows={3}
                disabled={disabled}
                placeholder={field.placeholder || ""}
                value={val || ""}
                onChange={(e) => setValue(field.id, e.target.value)}
              />
              {field.help_text ? <span className="muted" style={{ fontSize: "0.85rem" }}>{field.help_text}</span> : null}
            </label>
          );
        }

        if (field.field_type === "SINGLE_SELECT" || field.field_type === "MCQ") {
          return (
            <label key={field.id} style={{ display: "grid", gap: 6 }}>
              <span>{field.label}{field.required ? " *" : ""}</span>
              <Select disabled={disabled} value={val || ""} onChange={(e) => setValue(field.id, e.target.value)}>
                <option value="">Select…</option>
                {choices.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </label>
          );
        }

        if (field.field_type === "MULTI_SELECT") {
          return (
            <fieldset key={field.id} style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 6 }}>{field.label}{field.required ? " *" : ""}</legend>
              <div style={{ display: "grid", gap: 6 }}>
                {choices.map((c) => {
                  const selected = Array.isArray(val) ? val.includes(c) : false;
                  return (
                    <label key={c} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={selected}
                        onChange={(e) => {
                          const next = new Set(Array.isArray(val) ? val : []);
                          if (e.target.checked) next.add(c);
                          else next.delete(c);
                          setValue(field.id, Array.from(next));
                        }}
                      />
                      {c}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        }

        if (field.field_type === "CHECKBOX") {
          return (
            <label key={field.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={Boolean(val)}
                onChange={(e) => setValue(field.id, e.target.checked)}
              />
              <span>{field.label}{field.required ? " *" : ""}</span>
            </label>
          );
        }

        const inputType =
          field.field_type === "NUMBER" ? "number" :
          field.field_type === "EMAIL" ? "email" :
          field.field_type === "PHONE" ? "tel" :
          field.field_type === "DATE" ? "date" : "text";

        return (
          <label key={field.id} style={{ display: "grid", gap: 6 }}>
            <span>{field.label}{field.required ? " *" : ""}</span>
            <Input
              type={inputType}
              disabled={disabled}
              placeholder={field.placeholder || ""}
              value={val ?? ""}
              onChange={(e) => setValue(field.id, e.target.value)}
            />
            {field.help_text ? <span className="muted" style={{ fontSize: "0.85rem" }}>{field.help_text}</span> : null}
          </label>
        );
      })}
    </div>
  );
}

export function toFieldResponses(values = {}) {
  return Object.entries(values)
    .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([fieldId, value]) => ({ field_id: fieldId, value }));
}
