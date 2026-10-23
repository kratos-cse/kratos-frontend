"use client";

import { DynamicField } from "@/components/registration/DynamicField";
import { visibleFields } from "@/lib/registration/fieldUtils";

export function DynamicRegistrationForm({ fields, values, onChange, disabled }) {
  const items = visibleFields(fields);
  if (!items.length) return null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {items.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id]}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
